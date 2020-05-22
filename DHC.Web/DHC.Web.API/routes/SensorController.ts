import express = require('express');
import { DhcDatabase } from '../SQLite/database';
import { Request, Response } from 'express';
import { SqlCommand } from '../SQLite/common-db/SqlCommand';
import { nameof } from '../common/nameof';
import { isbooleantrue } from '../common/isbooleantrue';
import { SensorReading } from '../SQLite/tables/SensorReading';

// Register routes
const router = express.Router();
const root: string = '/';
router.get(root, getRoot);
router.post(root, postRoot);

/**
 * ROUTE: GET ./sensor
 * Returns all values from the SensorReading database table.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
function getRoot(req: Request, resp: Response): void {
    DhcDatabase.Context.all(`SELECT * FROM ${SensorReading.name}`, (err, data: SensorReading[]) => {
        if (err) console.log(err);

        resp.json(data);
    });
}

/**
 * ROUTE: POST ./sensor
 * Add the object in the request body to the database.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
function postRoot(req: Request, resp: Response): void {
    let reading: SensorReading = new SensorReading(req.body);
    if (!reading.validate()) {
        resp.status(400).send(new Error('Invalid object'));
        console.error('Sensor reading was invalid! ' + JSON.stringify(reading));
        return;
    }

    let insert: SqlCommand = reading.insert();
    DhcDatabase.Context.run(insert.command, insert.parameters, (err, data) => {
        if (err) {
            resp.status(500).json(err);
        } else {
            console.log(`Recorded ${reading.ReadingType} from ${reading.SourceHostName}:${reading.SensorModel} of ${reading.ReadingValue}`);
            resp.status(200).json(req.body);
        }
    });
}

export default router;