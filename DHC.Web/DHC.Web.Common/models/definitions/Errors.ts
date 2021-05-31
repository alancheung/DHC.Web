export class ArgumentError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

export class ArgumentMissingError extends ArgumentError {
    constructor(objName: string, argName: string) {
        super(`Missing ${objName} argument: '${argName}'!`);
    }
}

export class ArgumentOutOfRangeError extends ArgumentError {
    constructor(objName: string, argName: string) {
        super(`Out of range ${objName} argument: '${argName}'!`);
    }
}