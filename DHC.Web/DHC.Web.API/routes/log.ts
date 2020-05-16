import express = require('express');
import { db } from '../SQLite/database';
import { Request, Response } from 'express';
import { sqlCommand } from '../SQLite/sqlCommand';
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
            d.eventtime = new Date(d.eventtime);
        });

        resp.json(data);
    })
}

function postRoot(req: Request, resp: Response): void {
    let logEntry: AccessLog = req.body;
    let insert: sqlCommand = logEntry.insert();

    db.run(insert.command, insert.parameters, (err, data) => {
        if (err) {
            resp.status(500);
        } else {
            resp.status(200).json(data);
        }
    });
}






















export default router;