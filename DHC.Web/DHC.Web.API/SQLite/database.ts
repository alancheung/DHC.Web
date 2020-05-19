import { AccessLog } from "./tables/AccessLog";
import { SqlCommand } from "./sqlCommand";
import { VersionHistory } from "./tables/VersionHistory";
import { ApplicationSettings } from "../config/appconfig";
import { Project } from "./tables/Project";
import { Todo } from "./tables/Todo";
import { nameof } from "../common/nameof";

let sqlite3 = require('sqlite3').verbose();
let md5 = require('md5');

let DBSOURCE = ApplicationSettings.Config.dbSource;
console.log(`Database created from ${DBSOURCE} file.`);

/**
 * Common way to order some date column descending.
 * @param indexName Unique name of index
 * @param table Name of table
 * @param column Date column to order by latest
 */
function createLatestIndex(indexName: string, table: string, column: string) {
    return `CREATE INDEX IF NOT EXISTS "${indexName}" ON "${table}" ("${column}" DESC)`;
}

/**
 * Report the status of some run command.
 * @param err Error from SQLite3 if it exists.
 * @param tableName The table name this operation was performed on.
 */
function reportStatus (err: any, tableName: string) {
    if (err) {
        console.error(`${tableName} failed seed due to ${err}`);
    } else {
        console.log(`${tableName} finished seed!`);
    }
}

/** Database definition */
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(new AccessLog(null).createTable().command, (err) => reportStatus(err, AccessLog.name));
        db.run(new Project(null).createTable().command, (err) => reportStatus(err, Project.name));
        db.run(new Todo(null).createTable().command, (err) => reportStatus(err, Todo.name));

        // Create Indexes!
        db.run(createLatestIndex('LatestEventTime', AccessLog.name, nameof<AccessLog>("EventTime")));
        db.run(createLatestIndex('WipTodo', Todo.name, nameof<Todo>("EndDate")));

        console.log('Database created!');
    }
});

export { db }