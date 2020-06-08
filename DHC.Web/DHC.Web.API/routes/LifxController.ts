import express = require('express');
import { Request, Response } from 'express';
import { LifxWrapper } from '../LIFX/LifxWrapper';
import { LifxCommand } from '../LIFX/LifxCommand';

const LightManager: LifxWrapper = new LifxWrapper();

/** Router responsible for all requests relating to project/todo controls. */
const lifxRouter = express.Router();

// Register routes
const root: string = '/';
lifxRouter.post(root, controlLight);
lifxRouter.post(`/sequence`, sequenceControl);

/**
 * ROUTE: POST ./lifx
 * Send the command to the lights specified to run all at once.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
async function controlLight(req: Request, resp: Response) {
    let settings: LifxCommand = new LifxCommand(req.body);
    return await LightManager.sendCommand(settings)
        .then(() => resp.status(200).send())
        .catch((err) => resp.status(500).send(err));
}

/**
 * ROUTE: POST ./lifx/sequence
 * Send the command to the lights specified to run in a sequence with delay=duration.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
async function sequenceControl(req: Request, resp: Response) {
    let commands: any[] = req.body;
    let sequence: LifxCommand[] = commands.map(c => new LifxCommand(c));
    return await LightManager.sendSequence(sequence)
        .then(() => resp.status(200).send())
        .catch((err) => resp.status(500).send(err));
}



export default lifxRouter;