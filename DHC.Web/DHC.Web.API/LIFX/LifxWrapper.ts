import { LifxCommand } from "./LifxCommand";
const Lifx = require('node-lifx-lan');

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
    public handle(settings: LifxCommand) {
        let rejectChain: Promise<void> = Promise.reject();
        for (let attempt = 0; attempt < this._maxAttempts; attempt++) {
            rejectChain = rejectChain.catch(() => this.updateLights(settings)).catch(this._delay);
        }

        rejectChain = rejectChain.catch((err) => {
            console.log(`Light command failed after ${this._maxAttempts} attempts. Stopping command.`);
        });
    }

    /**
     * Parses the new light settings described in settings and updates the lights.
     * @param settings New light settings.
     */
    private async updateLights(settings: LifxCommand): Promise<void> {
        let cmdName: string = 'UNKNOWN';
        return await this._lifx.discover().then(() => {
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
                console.error(`Error sending '${cmdName}' command to '${settings.Lights}'`)
            } else {
                console.log(`Lights [${settings.Lights}] not found after discovery!`);
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

    public printDiscovery(device_list: any[]) {
        console.log('New discovery attempted!')
        device_list.forEach((device) => {
            console.log([device['ip'], device['mac'], device['deviceInfo']['label']].join(' | '));
        });
    }
}
