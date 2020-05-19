import { AccessLog } from "./tables/AccessLog";
import { SqlCommand } from "./sqlCommand";
import { VersionHistory } from "./tables/VersionHistory";
import { ApplicationSettings } from "../config/appconfig";

let sqlite3 = require('sqlite3').verbose();
let md5 = require('md5');

let DBSOURCE = ApplicationSettings.Config.dbSource;
console.log(`Database created from ${DBSOURCE} file.`);

/** Database definition */
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(new AccessLog(null).createTable().command, (err) => { if (!err) { console.log(`${AccessLog.name} finished seed!`); } });
        // db.run(new VersionHistory().createTable().command, (err) => { if (!err) { console.log(`${VersionHistory.name} finished seed!`); } });

        console.log('Database created!');
    }
});

export { db }