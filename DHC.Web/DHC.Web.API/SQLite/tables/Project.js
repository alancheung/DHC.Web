"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const sqlCommand_1 = require("../common-db/sqlCommand");
const DateTable_1 = require("../common-db/DateTable");
const nameof_1 = require("../../common/nameof");
class Project extends DateTable_1.DateTable {
    constructor(data) {
        super(data);
        if (data) {
            this.ID = data.ID;
        }
    }
    createTable() {
        let seed = `CREATE TABLE IF NOT EXISTS ${Project.name} (
            ${nameof_1.nameof("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof_1.nameof("StartDate")} TEXT NOT NULL,
            ${nameof_1.nameof("EndDate")} TEXT,
            ${nameof_1.nameof("Name")} TEXT NOT NULL,
            ${nameof_1.nameof("Description")} TEXT
            ${nameof_1.nameof("Link")} TEXT)`;
        return new sqlCommand_1.SqlCommand(seed, []);
    }
    insert() {
        return new sqlCommand_1.SqlCommand(`INSERT INTO ${Project.name} 
            (${nameof_1.nameof("StartDate")}, ${nameof_1.nameof("Name")}, ${nameof_1.nameof("Description")}, ${nameof_1.nameof("Link")}) 
            VALUES (?,?,?)`, [this.StartDate.toLocaleString(), this.Name, this.Description, this.Link]);
    }
}
exports.Project = Project;
//# sourceMappingURL=Project.js.map