import express = require('express');
import { Request, Response } from 'express';
import { Authentication, AuthorizedClient } from '../../DHC.Web.Common/SQLite/tables';
import { SqlCommand } from '../../DHC.Web.Common/SQLite/context';
import { DhcDatabase } from '../SQLite/database';
import { nameof } from '../../DHC.Web.Common/functions';

/** Router responsible for all requests relating to authorization or registering new codes. */
const authorizationRouter = express.Router();

// Register routes
authorizationRouter.post('/register/device', registerCode);
authorizationRouter.post('/register/client', registerClient);
authorizationRouter.post('/authenticate', authenticate);

/**
 * ROUTE: POST ./authorization/register/device
 * Register a new authorized device.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
async function registerCode(req: Request, resp: Response) {
    let newRecord: Authentication = new Authentication(req.body);

    if (!newRecord.validate()) {
        resp.status(400).send(new Error('Invalid object'));
        console.error('New authorized device was invalid! ' + JSON.stringify(newRecord));
        return;
    }

    let insert: SqlCommand = newRecord.insert();
    DhcDatabase.Context.run(insert.command, insert.parameters, (err, data) => {
        if (err) {
            console.log(err);
            resp.status(500).json(err);
        } else {
            console.log(`${new Date().toLocaleString()}: Registered new ${newRecord.Type} authorized device for client id ${newRecord.ClientId}`);
            resp.status(200).json(req.body);
        }
    });
}

/**
 * ROUTE: POST ./authorization/register/user
 * Register a new authorized client.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
async function registerClient(req: Request, resp: Response) {
    let newRecord: AuthorizedClient = new AuthorizedClient (req.body);

    if (!newRecord.validate()) {
        resp.status(400).send(new Error('Invalid object'));
        console.error('New authorized client was invalid! ' + JSON.stringify(newRecord));
        return;
    }

    let insert: SqlCommand = newRecord.insert();
    DhcDatabase.Context.run(insert.command, insert.parameters, (err, data) => {
        if (err) {
            console.log(err);
            resp.status(500).json(err);
        } else {
            console.log(`${new Date().toLocaleString()}: Registered new ${newRecord.Name} authorized client in zone ${newRecord.Zone}`);
            resp.status(200).json(req.body);
        }
    });
}

/**
 * ROUTE: POST ./authorization/authenticate
 * Authenticate the device.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
async function authenticate(req: Request, resp: Response) {
    let authenticationRecord: Authentication = new Authentication(req.body);
    if (!authenticationRecord.validate() || !req.body.ClientKey) {
        resp.status(400).send(new Error('Invalid object'));
        console.error('New authorized device was invalid! ' + JSON.stringify(authenticationRecord));
        return;
    }

    // Little nubbin guid on there. Yeah it's bad, but this whole thing is janky pretty much obfuscation anyways.
    let clientKey = req.body.ClientKey;

    // Two part authentication
    // 1) Verify client is authorized
    DhcDatabase.Context.all(
        `SELECT * 
        FROM ${AuthorizedClient.name}
        WHERE ${nameof<AuthorizedClient>("ID")} = ${authenticationRecord.ClientId} AND ${nameof<AuthorizedClient>("PublicKey")} = '${clientKey}'`,
        (err, data: any[]) => {
            if (err) {
                console.log(err);
                resp.status(401).json(err);
            } else if (data.length != 1) {
                console.log(`Found ${data.length} number of clients, should have only found 1!`);
                resp.status(401).send(new Error('Unauthorized!'));
            } else {
                // 2) Verify actual hash correct.
                DhcDatabase.Context.all(
                    `SELECT * 
                    FROM ${Authentication.name}
                    WHERE ${nameof<Authentication>("Hash")} = '${authenticationRecord.Hash}' AND ${nameof<Authentication>("ClientId")} = '${authenticationRecord.ClientId}' AND ${nameof<Authentication>("Type")} = '${authenticationRecord.Type}'`,
                    (err, data: any[]) => {
                        if (err) {
                            console.log(err);
                            resp.status(401).json(err);
                        } else if (data.length != 1) {
                            console.log(`Found ${data.length} number of authorized devices, should have only found 1!`);
                            resp.status(401).send(new Error('Unauthorized!'));
                        } else {
                            resp.status(200).send();
                        }
                    });
            }
        });


}

export default authorizationRouter;