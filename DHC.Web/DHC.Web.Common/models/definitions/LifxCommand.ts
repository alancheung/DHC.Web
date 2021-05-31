import { isbooleantrue } from "../../functions";

export class SequenceCommand {
    /** The number of times to repeat the sequence command. Alternative to firmware effects. */
    public Count: number;

    /** The command sequence */
    public Sequence: BaseLifxCommand[];
}

export class BaseLifxCommand {
    /** Array of light names */
    public Lights: string[];

    /** Flag stating whether this command should turn the lights on */
    public TurnOn: boolean;

    /** Flag stating whether this command should turn the lights off */
    public TurnOff: boolean;

    /** What zones does this effect */
    public Zones: number[];

    /** If multiple zones are defined, should we queue the commands or send them as received? */
    public ApplyZoneImmediately: boolean;

    /** Any fireware effects to play? */
    public Effect: number[];

    /** Transition duration of this command */
    public Duration: number;

    /** Delay after this command before the next */
    public Delay: number;

    /** Valid CSS color names: http://w3schools.sinsixx.com/css/css_colornames.asp.htm */
    public Color: string;

    /** Value between 0.0. and 1.0 */
    public Hue: number;

    /** Value between 0.0 and 1.0 */
    public Saturation: number;

    /** Value between 0.0 and 1.0 */
    public Brightness: number;

    /** Value between 2500 and 9000 */
    public Kelvin: number;

    constructor() { }

    public configure(data: any, colorManager: any): BaseLifxCommand {
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

        /** Added in later version (0.00.04+), may not be available */
        this.Zones = parsedData.Zones || [];
        this.Effect = parsedData.Effect || [];
        this.ApplyZoneImmediately = isbooleantrue(parsedData.ApplyZoneImmediately);

        // Prefer HSB values instead of CSSColor. Brightness always a required argument if other colors are set.
        this.Brightness = +parsedData.Brightness;
        // Kelvin not required as it not used by the colors (only applicable during transitions to/from white).
        this.Kelvin = +parsedData.Kelvin || 2500;

        if (parsedData.Color) {
            let obj: any = colorManager.cssToHsb({ css: parsedData.Color });
            this.Hue = obj.hsb.hue;
            this.Saturation = obj.hsb.saturation;
            // Brightness is ignored. 
            // It affects the color but since it directly controls lumen leave it up to the required parameter and get the color close enough.
        } else {
            // 0 == undefined == falsey, but number value required to prevent system from imploding.
            this.Hue = +parsedData.Hue || 0.0;
            this.Saturation = +parsedData.Saturation || 0.0;
        }

        if (isNaN(this.Duration)) {
            throw SyntaxError('Duration is a required argument!');
        }

        if (this.Zones.length > 0) {
            // Zone settings are at device level. Ensure only one device is given when attempting zone command
            if (this.Lights.length !== 1) {
                throw 'Cannot set zone command for more than one light!';
            }

            // Expected pairing of zone definitions
            if (this.Zones.length !== 2) {
                throw 'A zone definition must define a pair of [startingZone, numberOfZones] arguments!';
            }
        }

        if (this.Effect.length > 0) {
            // Zone effects are at device level. Ensure only one device is given when attempting zone command
            if (this.Lights.length !== 1) {
                throw 'Cannot set zone effect for more than one light!';
            }

            // Expected pairing of zone effects
            if (this.Effect.length !== 2) {
                throw 'A zone effect must define a pair of [effectType, direction] arguments!';
            }
        }

        return this;
    }
}

export class ZoneEffectLifxCommand extends BaseLifxCommand {

}

export class OnLifxCommand extends BaseLifxCommand {

}

export class OffLifxCommand extends BaseLifxCommand {

}

export class ZoneColorLifxCommand extends BaseLifxCommand {

}