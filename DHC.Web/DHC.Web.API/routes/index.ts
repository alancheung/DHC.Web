/*
 * GET home page.
 */
import express = require('express');
import { ApplicationSettings } from '../config/appconfig';
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    // Don't show access to API
    if (ApplicationSettings.Config.redirectAddress) {
        res.redirect(ApplicationSettings.Config.redirectAddress);
    } else {
        res.render('index', { title: 'DHC.Web' });
    }
});

export default router;