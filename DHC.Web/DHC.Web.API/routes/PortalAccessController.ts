import express = require('express');
import { DhcDatabase } from '../SQLite/database';
import { Request, Response } from 'express';
import { SqlCommand } from '../../DHC.Web.Common/SQLite/context';
import { PortalAccess } from '../../DHC.Web.Common/SQLite/tables';
import { nameof, isbooleantrue, mapTo, mapResults } from '../../DHC.Web.Common/functions';

// Register routes
const router = express.Router();
const root: string = '/';
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
    DhcDatabase.Context.all(`SELECT * FROM ${PortalAccess.name}`, (err, data: any[]) => {
        if (err) {
            console.log(err);
            resp.status(500).json(err);
        } else {
            resp.status(200).json(mapResults(PortalAccess, data));
        }
    });
}

/**
 * ROUTE: POST ./log
 * Add the object in the request body to the database.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
function postRoot(req: Request, resp: Response): void {
    let logEntry: PortalAccess;
    if (req.body.name && req.body.state && req.body.eventtime) {
        logEntry = req.body;
    } else {
        logEntry = new PortalAccess(req.body);
        logEntry.Name = req.body.Name;
        logEntry.State = isbooleantrue(req.body.State);
        logEntry.StartDate = req.body.StartDate || new Date();
    }

    let insert: SqlCommand = logEntry.insert();
    DhcDatabase.Context.run(insert.command, insert.parameters, (err, data: any[]) => {
        if (err) {
            console.log(err);
            resp.status(500).json(err);
        } else {
            console.log(`Inserted new ${logEntry.State ? 'open' : 'close'} record for ${logEntry.Name} at ${logEntry.StartDate.toLocaleString()}`);
            resp.status(200).json(mapResults(PortalAccess, data));
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

    let sqlCommand = `SELECT * FROM ${PortalAccess.name} WHERE ${nameof<PortalAccess>('Name')} LIKE ? ORDER BY ${nameof<PortalAccess>('StartDate')} DESC`;

    DhcDatabase.Context.all(sqlCommand, searchName, (err, data: PortalAccess[]) => {
        if (err) {
            console.log(err);
            resp.status(500).json(err);
        } else {
            resp.status(200).json(mapResults(PortalAccess, data));
        }
    });
}

export default router;