import express = require('express');
import { db } from '../SQLite/database';
import { Request, Response } from 'express';
import { SqlCommand } from '../SQLite/sqlCommand';
import { AccessLog } from '../SQLite/tables/AccessLog';
import { nameof } from '../common/nameof';

const router = express.Router();
const root: string = '/';

// Register routes
router.get(root, getRoot);
router.post(root, postRoot);

function getRoot(req: Request, resp: Response): void {
    db.all(`SELECT * FROM ${AccessLog.name}`, (err, data: AccessLog[]) => {
        if (err) throw err;

        // Convert string back to TS date
        data.forEach(d => {
            d.EventTime = new Date(d.EventTime);
        });

        resp.json(data);
    });
}

function postRoot(req: Request, resp: Response): void {
    let logEntry: AccessLog;
    if (req.body.name && req.body.state && req.body.eventtime) {
        logEntry = req.body;
    } else {
        logEntry = new AccessLog();
        logEntry.Name = req.body.name;
        logEntry.State = req.body.state;
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






















export default router;