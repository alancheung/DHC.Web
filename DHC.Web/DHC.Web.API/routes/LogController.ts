import express = require('express');
import { db } from '../SQLite/database';
import { Request, Response } from 'express';
import { SqlCommand } from '../SQLite/sqlCommand';
import { AccessLog } from '../SQLite/tables/AccessLog';
import { nameof } from '../common/nameof';
import { isbooleantrue } from '../common/isbooleantrue';

const router = express.Router();
const root: string = '/';

/**
 * Parse the return value of SQLiteDB.all commands for the AccessLog object.
 * @param error
 * @param data
 */
function parseDatabaseValues(error: any, data: AccessLog[]): AccessLog[] {
    if (error) console.log(error);

    // Convert string back to TS date
    if (data) {
        data.forEach(d => {
            d.EventTime = new Date(d.EventTime);
            d.State = isbooleantrue(d.State);
        });
        return data;
    } else {
        return new AccessLog[0];
    }
}


// Register routes
router.get(root, getRoot);
router.post(root, postRoot);
router.get(`${root}:name`, getLogsForName);

/**
 * ROUTE: GET ./log
 * Returns all values from the AccessLog database table.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
function getRoot(req: Request, resp: Response): void {
    db.all(`SELECT * FROM ${AccessLog.name}`, (err, data: AccessLog[]) => {
        data = parseDatabaseValues(err, data);

        resp.json(data);
    });
}

/**
 * ROUTE: POST ./log
 * Add the object in the request body to the database.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
function postRoot(req: Request, resp: Response): void {
    let logEntry: AccessLog;
    if (req.body.name && req.body.state && req.body.eventtime) {
        logEntry = req.body;
    } else {
        logEntry = new AccessLog();
        logEntry.Name = req.body.name;
        logEntry.State = isbooleantrue(req.body.state);
        logEntry.EventTime = req.body.eventtime || new Date();
    }

    let insert: SqlCommand = logEntry.insert();
    db.run(insert.command, insert.parameters, (err, data) => {
        if (err) {
            resp.status(500).json(err);
        } else {
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
function getLogsForName(req: Request, resp: Response): void {
    let searchName = `%${req.params.name}%`;

    let sqlCommand = `SELECT * FROM ${AccessLog.name} WHERE ${nameof<AccessLog>('Name')} LIKE ? ORDER BY ${nameof<AccessLog>('EventTime')} DESC`;

    db.all(sqlCommand, searchName, (err, data: AccessLog[]) => {
        data = parseDatabaseValues(err, data);
        resp.json(data);
    });
}

export default router;