"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const AccessLog_1 = require("./tables/AccessLog");
let sqlite3 = require('sqlite3').verbose();
let md5 = require('md5');
/** Filename of the database. */
const DBSOURCE = "dhc.sqlite";
/** Database definition */
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
    else {
        console.log('Connected to the SQLite database.');
        db.run(new AccessLog_1.AccessLog(null).createTable().command, (err) => { if (!err) {
            console.log(`${AccessLog_1.AccessLog.name} finished seed!`);
        } });
        // db.run(new VersionHistory().createTable().command, (err) => { if (!err) { console.log(`${VersionHistory.name} finished seed!`); } });
        console.log('Database created!');
    }
});
exports.db = db;
//# sourceMappingURL=database.js.map