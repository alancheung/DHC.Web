import { isbooleantrue } from "../../functions";
import { ArgumentError, ArgumentMissingError, ArgumentOutOfRangeError } from "./Errors";
import { ZONE_EFFECT_MOVE_DIRECTION, ZONE_EFFECT_TYPE } from "./Lifx";

/** The type of LifxCommand sent to the controller */
export enum LifxCommandType {
    ON = 0,
    OFF = 1,
    COLOR = 2,
    MULTI_COLOR = 3,
    MULTI_EFFECT = 4
}

export class SequenceCommand {
    /** The number of times to repeat the sequence command. Alternative to firmware effects. */
    public Count: number;

    /** The command sequence */
    public Sequence: BaseLifxCommand[];
}

/** Base level command containing required fields for all commands. */
export class BaseLifxCommand {
    /** The type of command that this base object represents (can be casted to an object of this LifxCommandType) */
    public LifxCommandType: LifxCommandType;

    /** Array of light names */
    public Lights: string[];

    /** Transition duration of this command */
    public Duration: number;

    /** Delay after this command before the next */
    public Delay: number;

    constructor(obj: any) {
        if (!obj) {
            throw SyntaxError('No data was present to parse!');
        }

        // JSON convert to handle arrays and stuff correctly.
        let parsedData = JSON.parse(JSON.stringify(obj));

        // Always parse the command type to be an int, but 0 is valid enum so check against null/undefined instead of falsey.
        if (parsedData.LifxCommandType != null) {
            this.LifxCommandType = isNaN(parsedData.CommandType)
                // If the LifxCommandType is a string, referencing the enum should give back a number.
                ? +LifxCommandType[parsedData.LifxCommandType]
                // Otherwise, it's already a number so save that off.
                : +parsedData.LifxCommandType;
        } else {
            throw new ArgumentMissingError(BaseLifxCommand.name, 'LifxCommandType');
        }

        // Must have at least one light to command.
        this.Lights = parsedData.Lights || [];
        if (this.Lights.length < 1) {
            throw new ArgumentMissingError(BaseLifxCommand.name, 'Lights');
        }

        // Duration required, but not really. Just default '0' if not given.
        this.Duration = +parsedData.Duration || 0;

        // Delay required, but not really. Just default '0' if not given.
        this.Delay = +parsedData.Delay || 0;
    }
}

/** Secondary command containing logic and fields to changing a light's color. */
export class ColorLifxCommand extends BaseLifxCommand {

    /** Should the light be turned on as part of this command? */
    public TurnOn: boolean;

    /** Valid CSS color names: http://w3schools.sinsixx.com/css/css_colornames.asp.htm */
    public Color: string;

    /** Value between 0.0. and 1.0 */
    public Hue: number;

    /** Value between 0.0 and 1.0 */
    public Saturation: number;

    /** Value between 0.0 and 1.0 */
    public Brightness: number;

    /** Value between 1500 and 9000 */
    public Kelvin: number;

    constructor(obj: any, colorManager: any) {
        if (!colorManager) {
            throw new SyntaxError(`'lifx-lan-color' argument required to parse color commands!`);
        }

        // Set the base level properties.
        super(obj);

        // JSON convert to handle arrays and stuff correctly.
        let parsedData = JSON.parse(JSON.stringify(obj));

        // Due to how the filter works, it's easier to represent an ON to a certain color command as a regular COLOR.
        // LifxWrapper determines the correct method to call based on this flag.
        this.TurnOn = isbooleantrue(parsedData.TurnOn);

        // Prefer HSB values instead of CSSColor. Brightness always a required argument if other colors are set.
        // 0.0 brightness is valid so only set to 1.0 if it was null or undefined
        if (parsedData.Brightness != null) {
            this.Brightness = +parsedData.Brightness
        } else {
            this.Brightness = 1.0;
        }

        // Kelvin not required as it not used by the colors (only applicable during transitions to/from white).
        // Minimum Kelvin value is 1500 (not 0!)
        this.Kelvin = +parsedData.Kelvin || 3500;

        if (parsedData.Color) {
            if (!(parsedData.Color in colorManager._CSS_COLOR_KEYWORDS)) {
                throw new ArgumentOutOfRangeError(ColorLifxCommand.name, parsedData.Color);
            }

            let obj: any = colorManager.cssToHsb({ css: parsedData.Color });
            this.Hue = obj.hsb.hue;
            this.Saturation = obj.hsb.saturation;
            // cssToHsb brightness is ignored. 
            // It affects the color but since it directly controls lumen leave it up to the required parameter and get the color close enough.
        } else {
            if (parsedData.Hue != null!) {
                this.Hue = +parsedData.Hue;
            } else {
                // If the Color is not set AND the Hue is missing, then throw an exception
                throw new ArgumentMissingError(ColorLifxCommand.name, 'Hue');
            }

            if (parsedData.Saturation != null) {
                this.Saturation = +parsedData.Saturation;
            } else {
                // If the Color is not set AND the Saturation is missing, then throw an exception
                throw new ArgumentMissingError(ColorLifxCommand.name, 'Saturation');
            }
        }
    }
}

/** High-level command containing logic and fields to turn a light ON */
export class OnLifxCommand extends BaseLifxCommand {
    constructor(obj: any) {
        super(obj);
    }
}

/** High-level command containing logic and fields to turn a light OFF. */
export class OffLifxCommand extends BaseLifxCommand {
    constructor(obj: any) {
        super(obj);
    }
}

/** High-level command containing logic and fields to turn a multi-zone light ON. */
export class ZoneColorLifxCommand extends ColorLifxCommand {
    /** What zones does this effect */
    public Zones: number[];

    /** If multiple zones are defined, should we queue the commands or send them as received? */
    public ApplyZoneImmediately: boolean;

    constructor(obj: any, colorManager: any) {
        super(obj, colorManager);

        // JSON convert to handle arrays and stuff correctly.
        let parsedData = JSON.parse(JSON.stringify(obj));

        // Require Zones if CommandType.MULTI_COLOR. If caller wanted to affect all zones, then use COLOR.
        if (parsedData.Zones != null) {
            this.Zones = parsedData.Zones;
        } else {
            throw new ArgumentMissingError(ZoneColorLifxCommand.name, 'Zones');
        }
        if (this.Zones.length !== 2) {
            throw new ArgumentError('A zone definition must define exactly a pair of [startingZone, numberOfZones] arguments!');
        }
        if (this.Lights.length !== 1) {
            throw new ArgumentError('Cannot set zone command for more than one light!');
        }

        if (parsedData.ApplyZoneImmediately != null) {
            this.ApplyZoneImmediately = isbooleantrue(parsedData.ApplyZoneImmediately);
        } else {
            throw new ArgumentMissingError(ZoneColorLifxCommand.name, 'ApplyZoneImmediately');
        }
    }
}

/** High-level command containing logic and fields to set a multi-zone light effect. */
export class ZoneEffectLifxCommand extends BaseLifxCommand {
    /** The type of firmware effect to command */
    public EffectType: ZONE_EFFECT_TYPE;

    /** The direction of the effect */
    public Direction: ZONE_EFFECT_MOVE_DIRECTION;

    /** How fast should the effect move? Combine with Duration to determine the number of times this effect runs (Speed / Duration == Count) */
    public Speed: number;

    constructor(obj: any) {
        super(obj);

        // JSON convert to handle arrays and stuff correctly.
        let parsedData = JSON.parse(JSON.stringify(obj));

        // Always parse the enums to be an int, but 0 is valid enum so check against null/undefined instead of falsey.
        if (parsedData.EffectType != null) {
            this.EffectType = isNaN(parsedData.EffectType)
                // If the value is a string, referencing the enum should give back a number.
                ? +ZONE_EFFECT_TYPE[parsedData.EffectType]
                // Otherwise, it's already a number so save that off.
                : +parsedData.EffectType;
        } else {
            throw new ArgumentMissingError(ZoneEffectLifxCommand.name, 'EffectType');
        }

        // Always parse the enums to be an int, but 0 is valid enum so check against null/undefined instead of falsey.
        if (parsedData.Direction != null) {
            this.Direction = isNaN(parsedData.Direction)
                // If the value is a string, referencing the enum should give back a number.
                ? +ZONE_EFFECT_MOVE_DIRECTION[parsedData.Direction]
                // Otherwise, it's already a number so save that off.
                : +parsedData.Direction;
        } else {
            this.Direction = ZONE_EFFECT_MOVE_DIRECTION.TOWARDS;
        }

        if (parsedData.Speed != null) {
            this.Speed = +parsedData.Speed;
        } else {
            throw new ArgumentMissingError(ColorLifxCommand.name, 'Speed');
        }
    }
}

