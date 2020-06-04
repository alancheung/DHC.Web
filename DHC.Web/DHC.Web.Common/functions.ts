/**
 * Determine if the value given is any form of boolean true.
 * @param obj Unknown value to determine
 */
export function isbooleantrue(obj: any) {
    if (typeof (obj) === 'boolean') {
        return obj;
    } else if (typeof (obj) === 'number') {
        return obj === 1;
    }
    else if (typeof (obj) === 'string') {
        return obj === 'True' || obj === 'true' || obj === 'yes' || obj === '1';
    } else {
        return false;
    }
};

/**
 * Typescript implementation of C# nameof operator
 * @param name Type T's property name.
 */
export function nameof<T>(name: keyof T) { return name };