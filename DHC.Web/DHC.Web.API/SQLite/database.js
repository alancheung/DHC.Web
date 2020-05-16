"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const AccessLog_1 = require("./tables/AccessLog");
let sqlite3 = require('sqlite3').verbose();
let md5 = require('md5');
/** Filename of the database. */
const DBSOURCE = "db.sqlite";
/** Database definition */
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
    else {
        console.log('Connected to the SQLite database.');
        db.run(AccessLog_1.AccessLog.createTable(), (err) => {
            if (!err) {
                // Open  yesterday
                let event;
                let seed;
                event = new AccessLog_1.AccessLog();
                event.name = 'Test';
                event.state = true;
                event.eventtime = new Date(new Date().setDate(new Date().getDate() - 1));
                seed = event.insert();
                db.run(seed.command, seed.parameters);
                // Close today
                event = new AccessLog_1.AccessLog();
                event.name = 'Test';
                event.state = false;
                event.eventtime = new Date();
                seed = event.insert();
                db.run(seed.command, seed.parameters);
            }
        });
    }
});
exports.db = db;
//# sourceMappingURL=database.js.map