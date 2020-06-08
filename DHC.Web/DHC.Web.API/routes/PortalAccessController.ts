import express = require('express');
import { DhcDatabase } from '../SQLite/database';
import { Request, Response } from 'express';
import { SqlCommand } from '../../DHC.Web.Common/SQLite/context';
import { PortalAccess } from '../../DHC.Web.Common/SQLite/tables';
import { nameof, isbooleantrue, mapResults } from '../../DHC.Web.Common/functions';

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
    let accessEvent: PortalAccess = new PortalAccess(req.body);
    if (!accessEvent.validate()) {
        resp.status(400).send("Portal access event was not valid.");
    }

    let insert: SqlCommand = accessEvent.insert();
    DhcDatabase.Context.run(insert.command, insert.parameters, (err, data: any[]) => {
        if (err) {
            console.log(err);
            resp.status(500).json(err);
        } else {
            console.log(`Inserted new ${accessEvent.State ? 'open' : 'close'} record for ${accessEvent.Name} at ${accessEvent.StartDate.toLocaleString()}`);
            resp.status(200).json(accessEvent);
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