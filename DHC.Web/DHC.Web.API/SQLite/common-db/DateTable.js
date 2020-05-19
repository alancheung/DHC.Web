"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTable = void 0;
class DateTable {
    constructor(data) {
        if (data) {
            this.ID = data.ID;
            this.parseDates(data.StartDate, data.EndDate);
        }
    }
    createTable() {
        throw new Error("Method should be implemented by child.");
    }
    insert() {
        throw new Error("Method should be implemented by child.");
    }
    /**
     * Convert string dates to TS Date objects.
     * @param start
     * @param end
     */
    parseDates(start, end) {
        this.StartDate = new Date(start);
        this.EndDate = new Date(end);
    }
}
exports.DateTable = DateTable;
//# sourceMappingURL=DateTable.js.map