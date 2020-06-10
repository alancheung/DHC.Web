import { isbooleantrue } from "../../DHC.Web.Common/functions";

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
    public Color: [number, number, number, number];

    /** Value between 0.0. and 1.0 */
    public get Hue() {
        return this.Color[0];
    }
    /** Value between 0.0 and 1.0 */
    public get Saturation() {
        return this.Color[1];
    }
    /** Value between 0.0 and 1.0 */
    public get Brightness() {
        return this.Color[2];
    }
    /** Value between 2500 and 9000 */
    public get Kelvin() {
        return this.Color[3];
    }

    constructor(data: any) {
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
        this.Color = [+parsedData.Hue, +parsedData.Saturation, +parsedData.Brightness, +parsedData.Kelvin];
    }

    /** Make sure that there is a value for all colors and a valid transition duration. */
    public validColorChange(): boolean {
        return this.Color.every(v => !!v || v == 0);
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