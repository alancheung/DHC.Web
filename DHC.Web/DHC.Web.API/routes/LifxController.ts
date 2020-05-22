import express = require('express');
import { Request, Response } from 'express';
import { isbooleantrue } from '../common/isbooleantrue';
import { LifxWrapper } from '../LIFX/LifxWrapper';

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
function controlLight(req: Request, resp: Response): void {
    let state = isbooleantrue(req.body.State);

    if (state) {
        LightManager.turnOnOffice();
    } else {
        LightManager.turnOffOffice();
    }


}

export default projectRouter;