"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const AccessLog_1 = require("./tables/AccessLog");
const appconfig_1 = require("../config/appconfig");
const Project_1 = require("./tables/Project");
const Todo_1 = require("./tables/Todo");
const nameof_1 = require("../common/nameof");
let sqlite3 = require('sqlite3').verbose();
let md5 = require('md5');
let DBSOURCE = appconfig_1.ApplicationSettings.Config.dbSource;
console.log(`Database created from ${DBSOURCE} file.`);
function createLatestIndex(indexName, table, columns) {
    return `CREATE INDEX IF NOT EXISTS "${indexName}" ON "${table}" ("${columns}" DESC)`;
}
function reportStatus(err, tableName) {
    if (err) {
        console.error(`${tableName} failed seed due to ${err}`);
    }
    else {
        console.log(`${tableName} finished seed!`);
    }
}
/** Database definition */
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
    else {
        console.log('Connected to the SQLite database.');
        db.run(new AccessLog_1.AccessLog(null).createTable().command, (err) => reportStatus(err, AccessLog_1.AccessLog.name));
        db.run(new Project_1.Project(null).createTable().command, (err) => reportStatus(err, Project_1.Project.name));
        db.run(new Todo_1.Todo(null).createTable().command, (err) => reportStatus(err, Todo_1.Todo.name));
        // Create Indexes!
        db.run(createLatestIndex('LatestEventTime', AccessLog_1.AccessLog.name, nameof_1.nameof("EventTime")));
        db.run(createLatestIndex('WipTodo', Todo_1.Todo.name, nameof_1.nameof("EndDate")));
        console.log('Database created!');
    }
});
exports.db = db;
//# sourceMappingURL=database.js.map