"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET home page.
 */
const express = require("express");
const appconfig_1 = require("../config/appconfig");
const router = express.Router();
router.get('/', (req, res) => {
    // Don't show access to API
    if (appconfig_1.ApplicationSettings.Config.redirectAddress) {
        res.redirect(appconfig_1.ApplicationSettings.Config.redirectAddress);
    }
    else {
        res.render('index', { title: 'DHC.Web' });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map