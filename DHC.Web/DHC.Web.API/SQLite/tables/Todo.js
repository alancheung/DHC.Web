"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
const sqlCommand_1 = require("../common-db/sqlCommand");
const DateTable_1 = require("../common-db/DateTable");
const nameof_1 = require("../../common/nameof");
const Project_1 = require("./Project");
class Todo extends DateTable_1.DateTable {
    constructor(data) {
        super(data);
        // Convert string back to TS date
        if (data) {
            this.ID = data.ID;
            this.Task = data.Task;
            this.Priority = data.Priority;
        }
    }
    createTable() {
        let seed = `CREATE TABLE IF NOT EXISTS ${Todo.name} (
            ${nameof_1.nameof("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof_1.nameof("StartDate")} TEXT NOT NULL,
            ${nameof_1.nameof("EndDate")} TEXT,
            ${nameof_1.nameof("Task")} TEXT NOT NULL,
            ${nameof_1.nameof("Priority")} INTEGER,
            ${nameof_1.nameof("ProjectId")} INTEGER REFERENCES ${Project_1.Project.name} (${nameof_1.nameof("ID")}) ON DELETE CASCADE)`;
        return new sqlCommand_1.SqlCommand(seed, []);
    }
    insert() {
        return new sqlCommand_1.SqlCommand(`INSERT INTO ${Todo.name} 
            (${nameof_1.nameof("StartDate")}, ${nameof_1.nameof("Priority")}, ${nameof_1.nameof("Task")}) 
            VALUES (?,?,?)`, [this.StartDate.toLocaleString(), this.Priority, this.Task]);
    }
}
exports.Todo = Todo;
//# sourceMappingURL=Todo.js.map