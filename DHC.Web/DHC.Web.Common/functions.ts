import { DatabaseTable } from "./SQLite/context";

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
        return obj.toLowerCase() === 'true'
            || obj.toLowerCase() === 'yes'
            || obj.toLowerCase() === 'open'
            || obj === '1';
    } else {
        return false;
    }
};

/**
 * Typescript implementation of C# nameof operator
 * @param name Type T's property name.
 */
export function nameof<T>(name: keyof T) { return name };

/**
 * Generic function to map results from a database command to the object type specified by TTable.
 * @param instantiator Object type constructor.
 * @param dataList List of data to map.
 */
export function mapResults<TTable extends DatabaseTable>(instantiator: new (obj) => TTable, dataList: any[]): TTable[] {
    return dataList.map(data => new instantiator(data));
}