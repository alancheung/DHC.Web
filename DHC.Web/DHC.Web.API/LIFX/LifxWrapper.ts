import { LifxCommand } from './LifxCommand';
import { LightInfo } from '../../DHC.Web.Common/models/models';
const Lifx = require('node-lifx-lan');

export class LifxWrapper {
    private _lifx: any = Lifx;
    public get LifxClient() {
        return this._lifx;
    }

    /** Maximum number of attempts to automatically handle a request */
    private _maxAttempts: number = 3;

    /** Pretty formatted (and TS) versions of this_lifx.device_lists */
    public KnownLights: LightInfo[];

    constructor() {
        this.runDiscovery(true)
            .catch((error) => {
                console.error(error);
            });
    }

    /** Run discover() and process results for lifx */
    public runDiscovery(log: boolean): Promise<LightInfo[]> {
        console.log('Attempting new discovery...');
        return this._lifx.discover().then((device_list) => this.handleDiscovery(device_list, log));
    }

    /**
     * Process the results of a discovery command.
     * @param device_list Device info from discover() command
     * @param log Flag to print results.
     */
    private handleDiscovery(device_list: any[], log: boolean = true): LightInfo[] {
        this.KnownLights = device_list.map(light => new LightInfo(light));

        log && this.KnownLights.forEach((light) => {
            console.log([light.IP, light.MAC, light.GroupName, light.LightName].join(' | '));
        });

        return this.KnownLights;
    }

    /**
     * Update the lights to the values described in settings
     * @param command 
     */
    public async sendCommand(command: LifxCommand): Promise<void> {
        let parsedCommand: any = command.convertToLifxLanFilter();
        console.log(`Parsed library light settings: ${JSON.stringify(parsedCommand)}`);

        // Attempt commands with delay!
        let rejectChain: Promise<void> = Promise.reject();
        for (let attempt = 0; attempt < this._maxAttempts; attempt++) {
            // Single command should attempt a discovery if any command has failed. Assume optimistic on first.
            let forceDiscovery: boolean = attempt != 0;
            rejectChain = rejectChain.catch(() => this.handle(forceDiscovery, command.Lights, command, parsedCommand)).catch(this.angryDelay);
        }

        // Give back the result from above
        return rejectChain = rejectChain.catch((err) => {
            console.log(`Light command failed after ${this._maxAttempts} attempts. Stopping command.`);
        });
    }

    /**
     * Update the lights to the values described in settings
     * @param sequence
     */
    public async sendSequence(sequence: LifxCommand[]): Promise<void> {
        let parsedSettings: any[] = sequence.map(cmd => cmd.convertToLifxLanFilter());
        console.log(`Parsed library light settings: ${JSON.stringify(parsedSettings)}`);
        let allInvolvedLights: any = this.getInvolvedLights(sequence);

        // Attempt commands with delay!
        let rejectChain: Promise<void> = Promise.reject();
        for (let attempt = 0; attempt < this._maxAttempts; attempt++) {
            rejectChain = rejectChain.catch(async () => {
                let cmdChain = Promise.resolve();

                for (let cmdCount = 0; cmdCount < parsedSettings.length; cmdCount++) {
                    // Run discovery if the first attempt has failed and this is the first command in the sequence
                    // Prevents running discovery before every command in a sequence.
                    let forceDiscovery: boolean = attempt != 0 && cmdCount == 0;
                    cmdChain = cmdChain
                        // Attach the next command in the sequence
                        .then(() => this.handle(forceDiscovery, allInvolvedLights, sequence[cmdCount], parsedSettings[cmdCount]))
                        // Delay to allow command to finish + a little extra
                        .then(() => this.happyDelay("Allow command duration", (sequence[cmdCount].Delay || 0) + 100));
                }

                return await cmdChain;
            });
            rejectChain = rejectChain.catch(this.angryDelay);
        }

        // Give back the result from above
        return rejectChain = rejectChain.catch((err) => {
            console.log(`Light command failed after ${this._maxAttempts} attempts. Stopping command.`);
        });
    }

    /**
     * Parses the new light settings described in settings and updates the lights.
     * @param forceDiscovery Should we attempt discovery before sending the command.
     * @param settings New light settings.
     * @param details Settings parameter converted to node-lifx-lan readable obj format.
     */
    private async handle(forceDiscovery: boolean, involvedLights: string[], settings: LifxCommand, details: any): Promise<void> {
        // Determine if this method should attempt a discovery before invoking the commands.
        let discover: Promise<void>;
        if (forceDiscovery || !this.lightsDiscovered(involvedLights)) {
            discover = this._lifx.discover().then(this.handleDiscovery);
        } else {
            // No reason to run
            discover = Promise.resolve();
        }

        let cmdName: string = 'UNKNOWN';
        return await discover.then(() => {
            console.log('Sending new command!')
            if (settings.TurnOn) {
                cmdName = 'ON';
                return Lifx.turnOnFilter(details);
            } else if (settings.TurnOff) {
                cmdName = 'OFF';
                return Lifx.turnOffFilter(details);
            } else {
                cmdName = 'COLOR';
                return Lifx.setColorFilter(details);
            }
        }).then(() => {
            console.log(`New '${cmdName}' command sent to '${settings.Lights}'!`);
        }).catch((err) => {
            console.log(`Error (${err}) sending '${cmdName}' command to '${settings.Lights}'! Known lights '${this._lifx._device_list.map(device => device['deviceInfo']['label'])}'`);
            throw 'Retry!';
        });
    }

    private happyDelay(reason: string, delay: number = 1000): Promise<void> {
        console.log(`Provided delay of ${delay}ms.`);
        return new Promise(function (resolve, reject) {
            setTimeout(resolve.bind(null, reason), delay);
        });
    }

    private angryDelay(reason: string, delay: number = 1000): Promise<void> {
        console.log(`Command failed. Setting delay of ${delay}ms.`);
        return new Promise(function (resolve, reject) {
            setTimeout(reject.bind(null, reason), delay);
        });
    }

    /**
     * Search the known devices and see if the given light names are there.
     * @param lightNames List of light names to search for.
     * @returns True if all of the lights in lightNames is in the _lifx.device_list
     */
    public lightsDiscovered(lightNames: string[]): boolean {
        // "For every light name we're looking for, it exists in the _lifx._device_list."
        return lightNames.every(name => this._lifx._device_list.map(device => device['deviceInfo']['label']).includes(name));
    }

    /**
     * Determine given a sequence of commands all of the lights needed for the sequence.
     * Prevents running discover in the middle of a sequence. Pre-run discover if not all known
     * @param sequence Sequence of commands upcoming.
     */
    public getInvolvedLights(sequence: LifxCommand[]): string[] {
        let lightNames: string[] = [].concat.apply([], sequence.map(cmd => cmd.Lights));
        return lightNames;
    }
}
