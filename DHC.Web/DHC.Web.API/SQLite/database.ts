import { AccessLog } from "./tables/AccessLog";
import { SqlCommand } from "./sqlCommand";
import { VersionHistory } from "./tables/VersionHistory";
import { ApplicationSettings } from "../config/appconfig";

let sqlite3 = require('sqlite3').verbose();
let md5 = require('md5');

/** Filename of the database. */
const DBSOURCE = "dhc.sqlite";

let test = ApplicationSettings.Config.currentDatabaseVersion;

/** Database definition */
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(new AccessLog().createTable(), (err) => { if (!err) { console.log(`${AccessLog.name} seeded!`); } });
        // db.run(new VersionHistory().createTable(), (err) => { if (!err) { console.log(`${VersionHistory.name} seeded!`); } });

        console.log('Database created!');
    }
});

export { db }