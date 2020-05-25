import express = require('express');
import { Request, Response } from 'express';
import { LifxWrapper } from '../LIFX/LifxWrapper';
import { LifxCommand } from '../LIFX/LifxCommand';

const LightManager: LifxWrapper = new LifxWrapper();

/** Router responsible for all requests relating to project/todo controls. */
const projectRouter = express.Router();

// Register routes
const root: string = '/';
projectRouter.post(`${root}`, controlLight);

/**
 * ROUTE: POST ./lifx
 * Add the object in the request body to the database.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
async function controlLight(req: Request, resp: Response) {
    let settings: LifxCommand = new LifxCommand(req.body);
    return await LightManager.handle(settings)
        .then(() => resp.status(200).send())
        .catch((err) => resp.status(500).send());
}

export default projectRouter;