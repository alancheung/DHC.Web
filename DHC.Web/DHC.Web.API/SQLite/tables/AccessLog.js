"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessLog = void 0;
const sqlCommand_1 = require("../sqlCommand");
class AccessLog {
    constructor(portal, open, eventtime) {
        this.portalName = portal;
        this.state = open;
        this.eventtime = eventtime;
    }
    static createTable() {
        let seed = `CREATE TABLE AccessLog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            state INTEGER,
            eventtime TEXT)`;
        return seed;
    }
    insert() {
        return new sqlCommand_1.sqlCommand(`INSERT INTO AccessLog (name, state, eventtime) VALUES (?,?,?)`, [this.portalName, this.state, this.eventtime.toLocaleString()]);
    }
}
exports.AccessLog = AccessLog;
//# sourceMappingURL=AccessLog.js.map