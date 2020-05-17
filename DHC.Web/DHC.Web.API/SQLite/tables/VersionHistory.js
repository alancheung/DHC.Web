"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionHistory = void 0;
const sqlCommand_1 = require("../sqlCommand");
const nameof_1 = require("../../common/nameof");
/** Types of things tracked by this version history table. */
var VersionHistoryModules;
(function (VersionHistoryModules) {
    VersionHistoryModules[VersionHistoryModules["Software"] = 0] = "Software";
    VersionHistoryModules[VersionHistoryModules["Database"] = 1] = "Database";
})(VersionHistoryModules || (VersionHistoryModules = {}));
class VersionHistory {
    /**
     * Determine if the provided database requires an upgrade based on the current version number
     * @param db Reference to the
     * @param version
     * @returns True if upgrade required, false otherwise.
     */
    static RequiresUpgrade(db, version) {
        db.run(`SELECT * FROM ${VersionHistory.name} ORDER BY ${nameof_1.nameof('Version')}`);
        return false;
    }
    createTable() {
        let seed = `CREATE TABLE IF NOT EXISTS ${VersionHistory.name} (
            ${nameof_1.nameof("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof_1.nameof("Module")} TEXT,
            ${nameof_1.nameof("Version")} INTEGER,
            ${nameof_1.nameof("Notes")} TEXT)`;
        return seed;
    }
    insert() {
        return new sqlCommand_1.SqlCommand(`INSERT INTO ${VersionHistory.name} 
            (${nameof_1.nameof("Module")}, ${nameof_1.nameof("Version")}, ${nameof_1.nameof("Notes")}) 
            VALUES (?,?,?)`, [this.Module, this.Version.toString(), this.Notes]);
    }
}
exports.VersionHistory = VersionHistory;
//# sourceMappingURL=VersionHistory.js.map