"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const database_1 = require("../SQLite/database");
const AccessLog_1 = require("../SQLite/tables/AccessLog");
const router = express.Router();
const root = '/';
// Register routes
router.get(root, getRoot);
router.post(root, postRoot);
function getRoot(req, resp) {
    database_1.db.all(`SELECT * FROM ${AccessLog_1.AccessLog.name}`, (err, data) => {
        if (err)
            throw err;
        // Convert string back to TS date
        data.forEach(d => {
            d.EventTime = new Date(d.EventTime);
        });
        resp.json(data);
    });
}
function postRoot(req, resp) {
    let logEntry;
    if (req.body.name && req.body.state && req.body.eventtime) {
        logEntry = req.body;
    }
    else {
        logEntry = new AccessLog_1.AccessLog();
        logEntry.Name = req.body.name;
        logEntry.State = req.body.state;
        logEntry.EventTime = req.body.eventtime || new Date();
    }
    let insert = logEntry.insert();
    database_1.db.run(insert.command, insert.parameters, (err, data) => {
        if (err) {
            resp.status(500).json(err);
        }
        else {
            console.log(`Inserted new ${logEntry.State ? 'open' : 'close'} record for ${logEntry.Name} at ${logEntry.EventTime.toLocaleString()}`);
            resp.status(200).json(data);
        }
    });
}
exports.default = router;
//# sourceMappingURL=log.js.map