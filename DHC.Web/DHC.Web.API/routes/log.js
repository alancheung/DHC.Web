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
        data.forEach(d => {
            d.eventtime = new Date(d.eventtime);
            console.log(d.eventtime.getTime());
        });
        resp.json(data);
    });
}
function postRoot(req, resp) {
    let logEntry = req.body;
    let insert = logEntry.insert();
    database_1.db.run(insert.command, insert.parameters, (err, data) => {
        if (err) {
            resp.status(500);
        }
        else {
            resp.status(200).json(data);
        }
    });
}
exports.default = router;
//# sourceMappingURL=log.js.map