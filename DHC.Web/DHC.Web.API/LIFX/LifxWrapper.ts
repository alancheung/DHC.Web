import { LifxCommand } from "./LifxCommand";
const Lifx = require('node-lifx-lan');

let _officeOne: any;
let _officeTwo: any;
let _officeThree: any;

export class LifxWrapper {
    private _lifx: any = Lifx;
    public get LifxClient() {
        return this._lifx;
    }

    /** Maximum number of attempts to automatically handle a request */
    private _maxAttempts: number = 3;

    constructor() {
        this.discover();
    }

    public discover(): void {
        this.LifxClient.discover().then(this.printDiscovery)
            .catch((error) => {
                console.error(error);
            });
    }

    /**
     * Update the lights to the values described in settings
     * @param settings
     */
    public async handle(settings: LifxCommand): Promise<void> {
        let details: any = {
            // Fake LifxLanFilter based on light name (label) only
            filters: settings.Lights.map(l => { return { label: l }; }),
            duration: settings.Duration
        };
        // Determine if the settings had a valid color change in it.
        if (settings.validColorChange()) {
            details.color = { hue: settings.Hue, saturation: settings.Saturation, brightness: settings.Brightness, kelvin: settings.Kelvin }
        }
        console.log(`Parsed light settings: ${JSON.stringify(details)}`);

        // Attempt commands with delay!
        let rejectChain: Promise<void> = Promise.reject();
        for (let attempt = 0; attempt < this._maxAttempts; attempt++) {
            rejectChain = rejectChain.catch(() => this.updateLights(settings, details)).catch(this._delay);
        }

        // Give back the result from above
        return rejectChain = rejectChain.catch((err) => {
            console.log(`Light command failed after ${this._maxAttempts} attempts. Stopping command.`);
        });
    }

    /**
     * Parses the new light settings described in settings and updates the lights.
     * @param settings New light settings.
     * @param details Settings parameter converted to node-lifx-lan readable obj format.
     */
    private async updateLights(settings: LifxCommand, details: any): Promise<void> {
        let discover: Promise<void>;
        if (this.lightsDiscovered(settings.Lights)) {
            // Lights are known let's ignore
            discover = Promise.resolve();
        } else {
            // Welp missing some lights, try to find.
            discover = this._lifx.discover().then(this.printDiscovery);
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
            if ((err.hasOwnProperty('message') && err.message.indexOf('No device was found') < 0)) {
                console.error(`Error (${err}) sending '${cmdName}' command to '${settings.Lights}'`)
            } else {
                console.log(`Lights [${settings.Lights}] not found after discovery! Known lights '${this._lifx._device_list.map(device => device['deviceInfo']['label'])}'`);
                throw 'Retry!';
            }
        });
    }

    /**
     * Return a rejected promise that delays for a given time.
     * @param reason 
     */
    private _delay(reason): Promise<void> {
        console.log('Command failed, setting delay of 1s before retry.');
        return new Promise(function (resolve, reject) {
            setTimeout(reject.bind(null, reason), 1000);
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

    public printDiscovery(device_list: any[]) {
        console.log('New discovery attempted!')
        device_list.forEach((device) => {
            if (device['deviceInfo']['label'] == 'Office One') {
                _officeOne = device;
            }
            if (device['deviceInfo']['label'] == 'Office Two') {
                _officeTwo = device;
            }
            if (device['deviceInfo']['label'] == 'Office Three') {
                _officeThree = device;
            }

            console.log([device['ip'], device['mac'], device['deviceInfo']['label']].join(' | '));
        });
        console.log('\n');
    }
}
