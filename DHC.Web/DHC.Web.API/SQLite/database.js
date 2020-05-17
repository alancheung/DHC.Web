"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const AccessLog_1 = require("./tables/AccessLog");
const VersionHistory_1 = require("./tables/VersionHistory");
const appconfig_1 = require("../config/appconfig");
let sqlite3 = require('sqlite3').verbose();
let md5 = require('md5');
/** Filename of the database. */
const DBSOURCE = "db.sqlite";
let test = appconfig_1.ApplicationSettings.Config.currentDatabaseVersion;
/** Database definition */
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
    else {
        console.log('Connected to the SQLite database.');
        db.run(new AccessLog_1.AccessLog().createTable(), (err) => { if (!err) {
            console.log(`${AccessLog_1.AccessLog.name} seeded!`);
        } });
        db.run(new VersionHistory_1.VersionHistory().createTable(), (err) => { if (!err) {
            console.log(`${VersionHistory_1.VersionHistory.name} seeded!`);
        } });
        console.log('Database created!');
    }
});
exports.db = db;
//# sourceMappingURL=database.js.map