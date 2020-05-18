export function isbooleantrue (obj: any) {
    if (typeof(obj) === 'boolean') {
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