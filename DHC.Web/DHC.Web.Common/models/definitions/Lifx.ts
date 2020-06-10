import { isbooleantrue } from "../../functions";

/** https://www.npmjs.com/package/node-lifx-lan#LifxLanDevice-object */
export class LightInfo {
    public IP: string;
    public MAC: string;
    public LightName: string;
    public GroupName: string;
    public State: LightState;

    constructor(device: any[]) {
        this.IP = device['ip'];
        this.MAC = device['mac'];
        this.LightName = device['deviceInfo']['label'];
        this.GroupName = device['deviceInfo']['group']['label'];
        this.State = undefined;
    }
}

/** https://www.npmjs.com/package/node-lifx-lan#LifxLanDevice-lightGet-method */
export class LightState {
    public Color: LightColor;
    public Power: boolean;
    public LightName: string;

    constructor(stateInfo: any) {
        this.Color = new LightColor(stateInfo['color']);
        this.Power = stateInfo['power'];
        this.LightName = stateInfo['label'];
    }
}

/** https://www.npmjs.com/package/node-lifx-lan#LifxLanColorHSB-object */
export class LightColor {
    public Hue: number;
    public Saturation: number;
    public Brightness: number;
    public Kelvin: number;

    constructor(colorInfo: any) {
        this.Hue = colorInfo['hue'];
        this.Saturation = colorInfo['saturation'];
        this.Brightness = colorInfo['brightness'];
        this.Kelvin = colorInfo['kelvin'];
    }
}

export class LifxCommand {
    /** Array of light names */
    public Lights: string[];

    /** Flag stating whether this command should turn the lights on */
    public TurnOn: boolean;

    /** Flag stating whether this command should turn the lights off */
    public TurnOff: boolean;

    /** Transition duration of this command */
    public Duration: number;

    /** Delay after this command before the next */
    public Delay: number;

    /** (Hue, Saturation, Brightness, Kelvin) */
    public Color: [number, number, number, number] = [-1.0, -1.0, -1.0, 2500];

    /** Value between 0.0. and 1.0 */
    public get Hue() {
        return this.Color[0];
    }
    public set Hue(val) {
        this.Color[0] = val;
    }

    /** Value between 0.0 and 1.0 */
    public get Saturation() {
        return this.Color[1];
    }
    public set Saturation(val) {
        this.Color[1] = val;
    }

    /** Value between 0.0 and 1.0 */
    public get Brightness() {
        return this.Color[2];
    }
    public set Brightness(val) {
        this.Color[2] = val;
    }

    /** Value between 2500 and 9000 */
    public get Kelvin() {
        return this.Color[3];
    }
    public set Kelvin(val) {
        this.Color[3] = val;
    }

    constructor() { }

    public configure(data: any): LifxCommand {
        if (!data) {
            throw SyntaxError('No data was present to parse!');
        }

        // JSON convert to handle arrays and stuff correctly.
        let parsedData = JSON.parse(JSON.stringify(data));
        this.Lights = parsedData.Lights;
        this.TurnOn = isbooleantrue(parsedData.TurnOn);
        this.TurnOff = isbooleantrue(parsedData.TurnOff);
        this.Duration = +parsedData.Duration;
        this.Delay = +parsedData.Delay;

        if (parsedData.Hue || parsedData.Saturation || parsedData.Brightness || parsedData.Kelvin) {
            this.Color = [+parsedData.Hue, +parsedData.Saturation, +parsedData.Brightness, +parsedData.Kelvin];
        }

        return this;
    }

    /** Make sure that there is a value for all colors and a valid transition duration. */
    public validColorChange(): boolean {
        return this.Color.every(v => !!v && v != -1);
    }

    public convertToLifxLanFilter(): any {
        let details: any = {
            // Fake LifxLanFilter based on light name (label) only
            filters: this.Lights.map(l => { return { label: l }; }),
            duration: this.Duration
        };
        // Determine if the settings had a valid color change in it.
        if (this.validColorChange()) {
            details.color = { hue: this.Hue, saturation: this.Saturation, brightness: this.Brightness, kelvin: this.Kelvin }
        }

        return details;
    }
}