import { AccessLog } from "./tables/AccessLog";
import { SqlCommand } from "./common-db/SqlCommand";
import { VersionHistory } from "./tables/VersionHistory";
import { ApplicationSettings } from "../config/appconfig";
import { Project } from "./tables/Project";
import { Todo } from "./tables/Todo";
import { nameof } from "../common/nameof";
import { SensorReading } from "./tables/SensorReading";

let sqlite3 = require('sqlite3').verbose();
let md5 = require('md5');

/** DHC representation of a SQLite3 database context */
class DhcDatabaseContext {
    /** Underlying database */
    private _db: any;

    public get Context(): any {
        return this._db;
    }

    constructor() {
        let DBSOURCE = ApplicationSettings.Config.dbSource;
        console.log(`Database created from ${DBSOURCE} file.`);

        // Create database
        this._db = new sqlite3.Database(DBSOURCE, (err) => {
            if (err) {
                // Cannot open database
                console.error(err.message);
                throw err;
            } else {
                console.log('Connected to the SQLite database.');
                this._db.run(new AccessLog(null).createTable().command, (err) => this.reportStatus(err, AccessLog.name, 'seed'));
                this._db.run(new Project(null).createTable().command, (err) => this.reportStatus(err, Project.name, 'seed'));
                this._db.run(new Todo(null).createTable().command, (err) => this.reportStatus(err, Todo.name, 'seed'));
                this._db.run(new SensorReading(null).createTable().command, err => this.reportStatus(err, SensorReading.name, 'seed'));
                console.log('Database Tables created created!');

                setTimeout(() => {
                    // Create Indexes!
                    console.log('Creating indexes after sleeping 1 second!');
                    this._db.run(this.createLatestIndex('LatestEventTime', AccessLog.name, nameof<AccessLog>("EventTime")), err => this.reportStatus(err, AccessLog.name, 'INDEX LatestEventTime'));
                    this._db.run(this.createLatestIndex('WipTodo', Todo.name, nameof<Todo>("EndDate")), err => this.reportStatus(err, Todo.name, 'INDEX WipTodo'));
                }, 1000);
            }
        });
    }

    /**
     * Report the status of some run command.
     * @param err Error from SQLite3 if it exists.
     * @param objName The table name this operation was performed on.
     */
    private reportStatus(err: any, objName: string, command: string): void {
        if (err) {
            console.error(`${objName} failed '${command}' due to ${err}`);
        } else {
            console.log(`${objName} finished ${command}!`);
        }
    }

    /**
    * Common way to order some date column descending.
    * @param indexName Unique name of index
    * @param table Name of table
    * @param column Date column to order by latest
    */
    private createLatestIndex(indexName: string, table: string, column: string): string {
        return `CREATE INDEX IF NOT EXISTS "${indexName}" ON "${table}" ("${column}" DESC)`;
    }

}

let DhcDatabase = new DhcDatabaseContext();
export { DhcDatabase, DhcDatabaseContext }