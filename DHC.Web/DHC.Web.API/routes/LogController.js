"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const database_1 = require("../SQLite/database");
const AccessLog_1 = require("../SQLite/tables/AccessLog");
const nameof_1 = require("../common/nameof");
const isbooleantrue_1 = require("../common/isbooleantrue");
// Register routes
const router = express.Router();
const root = '/';
router.get(root, getRoot);
router.post(root, postRoot);
router.get(`${root}:name`, getLogsForName);
/**
 * ROUTE: GET ./log
 * Returns all values from the AccessLog database table.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
function getRoot(req, resp) {
    database_1.db.all(`SELECT * FROM ${AccessLog_1.AccessLog.name}`, (err, data) => {
        if (err)
            console.log(err);
        data = data.map(d => new AccessLog_1.AccessLog(d));
        resp.json(data);
    });
}
/**
 * ROUTE: POST ./log
 * Add the object in the request body to the database.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
function postRoot(req, resp) {
    let logEntry;
    if (req.body.name && req.body.state && req.body.eventtime) {
        logEntry = req.body;
    }
    else {
        logEntry = new AccessLog_1.AccessLog(req.body);
        logEntry.Name = req.body.Name;
        logEntry.State = isbooleantrue_1.isbooleantrue(req.body.State);
        logEntry.EventTime = req.body.EventTime || new Date();
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
/**
 * ROUTE: GET ./log/{name}
 * Add the object in the request body to the database.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
function getLogsForName(req, resp) {
    let searchName = `%${req.params.name}%`;
    let sqlCommand = `SELECT * FROM ${AccessLog_1.AccessLog.name} WHERE ${nameof_1.nameof('Name')} LIKE ? ORDER BY ${nameof_1.nameof('EventTime')} DESC`;
    database_1.db.all(sqlCommand, searchName, (err, data) => {
        if (err)
            console.log(err);
        data = data.map(d => new AccessLog_1.AccessLog(d));
        resp.json(data);
    });
}
exports.default = router;
//# sourceMappingURL=LogController.js.map