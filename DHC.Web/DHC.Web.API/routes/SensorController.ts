import express = require('express');
import { DhcDatabase } from '../SQLite/database';
import { Request, Response } from 'express';
import { nameof } from '../../DHC.Web.Common/functions';

import { SqlCommand } from '../../DHC.Web.Common/SQLite/databaseContext';
import { SensorReading } from '../../DHC.Web.Common/SQLite/tables';

// Register routes
const router = express.Router();
router.get('/locations', getSensorLocations)
router.get('/locations/:location', getReadingsForLocation)
router.get('/', getRoot);
router.post('/', postRoot);

function getSensorLocations(req: Request, resp: Response): void {
    DhcDatabase.Context.all(`SELECT DISTINCT(${nameof<SensorReading>("Location")}) FROM ${SensorReading.name} ORDER BY ${nameof<SensorReading>("Location")}`,
        (err, data: SensorReading[]) => {
        if (err) {
            console.log(err);
            resp.json(err);
        } else {
            resp.json(data);
        }
    });
}

function getReadingsForLocation(req: Request, resp: Response): void {
    DhcDatabase.Context.all(`SELECT * FROM ${SensorReading.name} WHERE ${nameof<SensorReading>("Location")} = ? ORDER BY ${nameof<SensorReading>("ID")} DESC LIMIT 300`, req.params.location,
        (err, data: SensorReading[]) => {
            if (err) {
                console.log(err);
                resp.json(err);
            } else {
                resp.json(data);
            }
        });
}

/**
 * ROUTE: GET ./sensor
 * Returns all values from the SensorReading database table.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
function getRoot(req: Request, resp: Response): void {
    DhcDatabase.Context.all(`SELECT * FROM ${SensorReading.name} ORDER BY ${nameof<SensorReading>("ID")} DESC LIMIT 300`, (err, data: SensorReading[]) => {
        if (err) {
            console.log(err);
            resp.json(err);
        } else {
            resp.json(data);
        }
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
            console.log(`${new Date().toLocaleString()}: Recorded ${reading.ReadingType} from ${reading.SourceHostName}:${reading.SensorModel} of ${reading.ReadingValue}`);
            resp.status(200).json(req.body);
        }
    });
}

export default router;