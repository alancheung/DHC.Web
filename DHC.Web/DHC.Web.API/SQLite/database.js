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
/**
 * Common way to order some date column descending.
 * @param indexName Unique name of index
 * @param table Name of table
 * @param column Date column to order by latest
 */
function createLatestIndex(indexName, table, column) {
    return `CREATE INDEX IF NOT EXISTS "${indexName}" ON "${table}" ("${column}" DESC)`;
}
/**
 * Report the status of some run command.
 * @param err Error from SQLite3 if it exists.
 * @param tableName The table name this operation was performed on.
 */
function reportStatus(err, tableName, command) {
    if (err) {
        console.error(`${tableName} failed '${command}' due to ${err}`);
    }
    else {
        console.log(`${tableName} finished ${command}!`);
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
        db.run(new AccessLog_1.AccessLog(null).createTable().command, (err) => reportStatus(err, AccessLog_1.AccessLog.name, 'seed'));
        db.run(new Project_1.Project(null).createTable().command, (err) => reportStatus(err, Project_1.Project.name, 'seed'));
        db.run(new Todo_1.Todo(null).createTable().command, (err) => reportStatus(err, Todo_1.Todo.name, 'seed'));
        console.log('Database Tables created created!');
        setTimeout(() => {
            // Create Indexes!
            console.log('Creating indexes after sleeping 1 second!');
            db.run(createLatestIndex('LatestEventTime', AccessLog_1.AccessLog.name, nameof_1.nameof("EventTime")), err => reportStatus(err, AccessLog_1.AccessLog.name, 'INDEX LatestEventTime'));
            db.run(createLatestIndex('WipTodo', Todo_1.Todo.name, nameof_1.nameof("EndDate")), err => reportStatus(err, Todo_1.Todo.name, 'INDEX WipTodo'));
        }, 1000);
    }
});
exports.db = db;
//# sourceMappingURL=database.js.map