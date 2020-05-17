"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isbooleantrue = void 0;
function isbooleantrue(obj) {
    if (typeof (obj) === 'boolean') {
        return obj;
    }
    else if (typeof (obj) === 'number') {
        return obj === 1;
    }
    else if (typeof (obj) === 'string') {
        return obj === 'True' || obj === 'true' || obj === 'yes' || obj === '1';
    }
    else {
        return false;
    }
}
exports.isbooleantrue = isbooleantrue;
;
//# sourceMappingURL=isbooleantrue.js.map