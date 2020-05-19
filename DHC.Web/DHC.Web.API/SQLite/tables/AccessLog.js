"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessLog = void 0;
const sqlCommand_1 = require("../common-db/sqlCommand");
const nameof_1 = require("../../common/nameof");
const isbooleantrue_1 = require("../../common/isbooleantrue");
class AccessLog {
    constructor(data) {
        if (data) {
            this.ID = data.ID;
            this.Name = data.Name;
            // Convert string back to TS date
            this.EventTime = new Date(data.EventTime);
            this.State = isbooleantrue_1.isbooleantrue(data.State);
        }
    }
    createTable() {
        let seed = `CREATE TABLE IF NOT EXISTS ${AccessLog.name} (
            ${nameof_1.nameof("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof_1.nameof("Name")} TEXT,
            ${nameof_1.nameof("State")} INTEGER,
            ${nameof_1.nameof("EventTime")} TEXT NOT NULL)`;
        return new sqlCommand_1.SqlCommand(seed, []);
    }
    insert() {
        return new sqlCommand_1.SqlCommand(`INSERT INTO ${AccessLog.name} 
            (${nameof_1.nameof("Name")}, ${nameof_1.nameof("State")}, ${nameof_1.nameof("EventTime")}) 
            VALUES (?,?,?)`, [this.Name, this.State, this.EventTime.toLocaleString()]);
    }
}
exports.AccessLog = AccessLog;
//# sourceMappingURL=AccessLog.js.map