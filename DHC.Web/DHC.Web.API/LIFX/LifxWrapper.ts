import { LightInfo, LifxCommand, LightState } from '../../DHC.Web.Common/models/models';
import Lifx = require('node-lifx-lan');

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
    public async runDiscovery(log: boolean): Promise<LightInfo[]> {
        console.log('Attempting new discovery...');
        return await this._lifx.discover().then((device_list) => this.handleDiscovery(device_list, log));
    }

    /**
     * Process the results of a discovery command.
     * @param device_list Device info from discover() command
     * @param log Flag to print results.
     */
    private handleDiscovery(device_list: any[], log: boolean = true): LightInfo[] {
        this.KnownLights = device_list.map(light => new LightInfo(light));

        log && this.KnownLights.forEach((light) => {
            console.log([light.IP, light.MAC, light.GroupName, light.LightName].join(' \t '));
        });

        return this.KnownLights;
    }

    /**
     * Update the lights to the values described in settings
     * @param command 
     */
    public async sendCommand(command: LifxCommand): Promise<void> {

        // Attempt commands with delay!
        let rejectChain: Promise<void> = Promise.reject();
        for (let attempt = 0; attempt < this._maxAttempts; attempt++) {
            // Single command should attempt a discovery if any command has failed. Assume optimistic on first.
            let forceDiscovery: boolean = attempt != 0;
            rejectChain = rejectChain.catch(() => this.handle(forceDiscovery, command.Lights, [command], 0))
                .catch(this.angryDelay);
        }

        // Give back the result from above
        return rejectChain = rejectChain.catch((err) => {
            let msg = `Light command failed after ${this._maxAttempts} attempts. Stopping command.`;
            console.log(msg);
            throw err || msg;
        });
    }

    /**
     * Update the lights to the values described in settings
     * @param sequence
     */
    public async sendSequence(sequence: LifxCommand[]): Promise<void> {
        // Get the list of involved lights for all lights in the sequence to ensure that all lights have been discovered before 
        // running the commands. Prevents sending a sequence commands and then having to break to discover.
        let allInvolvedLights: any = this.getInvolvedLights(sequence);

        // The last successfully completed set. Allows system to restart attempt at the failed command and not repeat.
        let lastCompletedCommand: number = 0;

        // Give extra retries to get through sequence since it can fail on multiple steps. Completely arbitrary modifier.
        let sequenceAttempts = 2 * this._maxAttempts;

        // Start with a rejection in order to continually retry on rejections.
        let rejectChain: Promise<void> = Promise.reject();
        for (let attempt = 0; attempt < sequenceAttempts; attempt++) {
            rejectChain = rejectChain.catch(async () => {
                let cmdChain = Promise.resolve();

                for (let cmdCount = lastCompletedCommand; cmdCount < sequence.length; cmdCount++) {
                    // Run discovery if the first attempt has failed and this is the first command in the (new) sequence
                    // Prevents running discovery before every command in a sequence in a retry.
                    let forceDiscovery: boolean = attempt != 0 && cmdCount == lastCompletedCommand;
                    cmdChain = cmdChain
                        // Attach the next command in the sequence
                        .then(() => this.handle(forceDiscovery, allInvolvedLights, sequence, cmdCount))
                        // Delay to allow command to finish + a little extra
                        .then(async () => {
                            await this.happyDelay("Allow command delay", (sequence[cmdCount].Delay || 0));
                            lastCompletedCommand = cmdCount;
                        });
                }

                return await cmdChain;
            });
            rejectChain = rejectChain.catch(this.angryDelay);
        }

        // Give back the result from above
        return rejectChain = rejectChain.catch((err) => {
            let msg = `Light sequence failed after ${sequenceAttempts} attempts. Stopping command.`;
            console.log(msg);
            throw err || msg;
        });
    }

    /**
     * Parses the new light settings described in settings and updates the lights.
     * @param forceDiscovery Should we attempt discovery before sending the command.
     * @param settings New light settings.
     * @param details Settings parameter converted to node-lifx-lan readable obj format.
     * @param cmdCount The index of the commmand currently being handled.
     */
    private async handle(forceDiscovery: boolean, involvedLights: string[], settings: LifxCommand[], cmdCount: number): Promise<void> {
        // Determine if this method should attempt a discovery before invoking the commands.
        let discover: Promise<void>;
        if (forceDiscovery || !this.lightsDiscovered(involvedLights)) {
            discover = this._lifx.discover().then((device_list) => this.handleDiscovery(device_list));
        } else {
            // No reason to run
            discover = Promise.resolve();
        }

        // Get the single command
        let runCommand: LifxCommand = settings[cmdCount];

        return await discover.then(async () => {
            if (runCommand.Zones.length > 0) {
                console.log(`Zone command parsed for '${runCommand.Lights}' - ${JSON.stringify(runCommand)}!`);
                // Validated to be only one device if Zones are specified.
                let stripLight: any = await this.getDevice(runCommand.Lights[0]);

                let zoneCommand: any = {
                    start    : runCommand.Zones[0],
                    end      : runCommand.Zones[0] + runCommand.Zones[1],
                    color    : {
                        hue        : runCommand.Hue,
                        saturation : runCommand.Saturation,
                        brightness : runCommand.Brightness,
                        kelvin     : runCommand.Kelvin
                    },
                    duration : runCommand.Duration,
                    // Apply if it is the last command in the sequence or we are immediately applying commands.
                    apply    : (cmdCount === settings.length - 1 || runCommand.ApplyZoneImmediately) ? 1 : 0, 
                };
                return await stripLight.multiZoneSetColorZones(zoneCommand);

            } else if (runCommand.TurnOn) {
                let runDetail: any = runCommand.convertToLifxLanFilter();
                console.log(`Parsed library light ON command settings: ${JSON.stringify(runDetail)}`);
                return await Lifx.turnOnFilter(runDetail);
            } else if (runCommand.TurnOff) {
                let runDetail: any = runCommand.convertToLifxLanFilter();
                console.log(`Parsed library light OFF command settings: ${JSON.stringify(runDetail)}`);
                return await Lifx.turnOffFilter(runDetail);
            } else {
                let runDetail: any = runCommand.convertToLifxLanFilter();
                console.log(`Parsed library light COLOR command settings: ${JSON.stringify(runDetail)}`);
                return await Lifx.setColorFilter(runDetail);
            }
        }).then(() => {
            console.log(`Command ${cmdCount} sent`);
        }).catch((err) => {
            console.log(`Error (${err}) sending command to '${runCommand.Lights}'! Known lights '${this._lifx._device_list.map(device => device['deviceInfo']['label'])}'`);
            throw err;
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
        let knownDeviceNames: string[] = this._lifx._device_list.map(device => device['deviceInfo']['label']);
        return lightNames.every(name => knownDeviceNames.includes(name));
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

    /** 
     * Get an underlying LifxDevice object.
     * @param name The deviceInfo.label of the light
     */
    private getDevice(name: string): Promise<any> {
        let device: any = this._lifx._device_list.find(device => device['deviceInfo']['label'] == name);

        if (!device) {
            throw Error(`'${name}' was not a known device. Run discover()?`)
        }

        return Promise.resolve(device);
    }

    /**
     * Get specific details for the named light
     * @param name The deviceInfo.label of the light
     */
    public getDetail(name: string): Promise<LightState> {
        return this.getDevice(name).then(device => device.lightGet().then(info => new LightState(info)));
    }

    /**
     * Get specific details for the named multi-zone light
     * @param name The deviceInfo.label of the light
     */
    public getZoneDetail(name: string): Promise<any> {
        return this.getDevice(name).then(device => device.multiZoneGetColorZones({ start: 0, end: 16 }));
    }
}
