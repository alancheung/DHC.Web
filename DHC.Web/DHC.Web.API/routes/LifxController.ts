import express = require('express');
import { Request, Response } from 'express';
import { LifxWrapper } from '../LIFX/LifxWrapper';
import { LifxCommand } from '../../DHC.Web.Common/models/models';

const LightManager: LifxWrapper = new LifxWrapper();

/** Router responsible for all requests relating to project/todo controls. */
const lifxRouter = express.Router();

// Register routes
lifxRouter.post('/', controlLight);
lifxRouter.post(`/sequence`, sequenceControl);

lifxRouter.get('/discover', getDiscoveredLights);
lifxRouter.post('/discover', runDiscovery);

lifxRouter.get('/light/:name', getLightDetails);
lifxRouter.get('/zone/:name', getZoneDetails);

lifxRouter.post('/test', apiTest);

/**
 * ROUTE: GET ./api/lifx/light/{name}
 * Get the details of the light with the name={name}
 * @param req Express Request object.
 * @param resp Express Response object.
 */
async function getLightDetails(req: Request, resp: Response) {
    await LightManager.getDetail(req.params.name)
        .then((detail) => resp.status(200).json(detail))
        .catch((err) => resp.status(500).json(err));
}

/**
 * ROUTE: GET ./api/lifx/zone/{name}
 * Get the details of the light with the name={name}
 * @param req Express Request object.
 * @param resp Express Response object.
 */
async function getZoneDetails(req: Request, resp: Response) {
    await LightManager.getZoneDetail(req.params.name)
        .then((detail) => resp.status(200).json(detail))
        .catch((err) => resp.status(500).json(err));
}

/**
 * ROUTE: GET ./api/lifx/discover
 * Get all discovered lights
 * @param req Express Request object.
 * @param resp Express Response object.
 */
function getDiscoveredLights(req: Request, resp: Response) {
    resp.status(200).json(LightManager.KnownLights);
}

/**
 * ROUTE: POST ./api/lifx/discover
 * Run discovery and give back all known lights
 * @param req Express Request object.
 * @param resp Express Response object.
 */
async function runDiscovery(req: Request, resp: Response) {
    await LightManager.runDiscovery(false)
        .then((lights) => resp.status(200).json(lights))
        .catch((err) => resp.status(500).json(err));
}

/**
 * ROUTE: POST ./api/lifx/
 * Send the command to the lights specified to run all at once.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
async function controlLight(req: Request, resp: Response) {
    try {
        let settings: LifxCommand = new LifxCommand().configure(req.body, LightManager.ColorManager);
        return await LightManager.sendCommand(settings)
            .then(() => resp.status(200).send('OK'))
            .catch((err) => resp.status(500).json(err));
    } catch (err) {
        resp.status(500).json(err);
    }
}

/**
 * ROUTE: POST ./api/lifx/sequence
 * Send the command to the lights specified to run in a sequence with delay=duration.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
async function sequenceControl(req: Request, resp: Response) {
    try {
        let count: number = +req.body.Count;
        let commands: any[] = req.body.Sequence;
        let sequence: LifxCommand[] = commands.map(c => new LifxCommand().configure(c, LightManager.ColorManager));

        let sequencePromise: Promise<void> = Promise.resolve();
        for (let repeatCount = 0; repeatCount < count; repeatCount++) {
            sequencePromise = sequencePromise.then(async () => {
                await LightManager.sendSequence(sequence);
                console.log(`Completed sequence repeat ${repeatCount}`);
            })
        }

        return await sequencePromise
            .then(() => resp.status(200).send('OK'))
            .catch((err) => resp.status(500).json(err));
    } catch (err) {
        resp.status(500).json(err);
    }
}

/**
 * ROUTE: POST ./api/lifx/test
 * Blank Test function.
 * @param req Express Request object.
 * @param resp Express Response object.
 */
async function apiTest(req: Request, resp: Response) {
    try {
        let settings: LifxCommand = new LifxCommand().configure(req.body, LightManager.ColorManager);

        let colorGuy: any = LightManager.ColorManager;
        let rgb = colorGuy.hsbToRgb({ hue: settings.Hue, saturation: settings.Saturation, brightness: settings.Brightness, kelvin: settings.Kelvin })

        resp.status(200).json(rgb);
    } catch (err) {
        resp.status(500).json(err);
    }
}

export default lifxRouter;