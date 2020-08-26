import { ApplicationSettings } from "../config/appconfig";
import { SensorReading, Log, PortalAccess, AuthorizedClient, Authentication } from '../../DHC.Web.Common/SQLite/tables';
import { nameof } from "../../DHC.Web.Common/functions";

let sqlite3 = require('sqlite3').verbose();
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
                this._db.run(new PortalAccess(null).createTable().command, (err) => this.reportStatus(err, PortalAccess.name, 'CREATE'));
                this._db.run(new SensorReading(null).createTable().command, err => this.reportStatus(err, SensorReading.name, 'CREATE'));
                this._db.run(new Log(null).createTable().command, err => this.reportStatus(err, Log.name, 'CREATE'));
                this._db.run(new AuthorizedClient(null).createTable().command, err => this.reportStatus(err, AuthorizedClient.name, 'CREATE'));
                this._db.run(new Authentication(null).createTable().command, err => this.reportStatus(err, Authentication.name, 'CREATE'));
                console.log('Database Tables created!');

                setTimeout(() => {
                    // Create Indexes!
                    console.log('Creating indexes after sleeping 1 second!');
                    this._db.run(this.createLatestIndex('LatestPortalAccess', PortalAccess.name, nameof<PortalAccess>("StartDate")), err => this.reportStatus(err, PortalAccess.name, 'INDEX LatestPortalAccess'));

                    console.log('Now seeding initial data!');
                    let seedAuthorizationCommands = this.seedAuthorizedClients();
                    seedAuthorizationCommands.forEach(command => {
                        this._db.run(command, err => this.reportStatus(err, AuthorizedClient.name, 'SEED AuthorizedClients'));
                    });
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

    private seedAuthorizedClients(): string[] {
        let clients: any[] = ApplicationSettings.Config.authorizedClients;

        let commands: string[] = clients.map(c => {
            return `INSERT INTO ${AuthorizedClient.name}(${nameof<AuthorizedClient>("PublicKey")},${nameof<AuthorizedClient>("Name")},${nameof<AuthorizedClient>("Zone")}) 
                    SELECT '${c.PublicKey}', '${c.Name}', '${c.Zone}'
                    WHERE NOT EXISTS(SELECT 1 FROM ${AuthorizedClient.name} WHERE ${nameof<AuthorizedClient>("PublicKey")} = '${c.PublicKey}')`});

        return commands;
    }
}

let DhcDatabase = new DhcDatabaseContext();
export { DhcDatabase, DhcDatabaseContext }