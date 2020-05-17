"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appconfig_1 = require("./config/appconfig");
const express = require("express");
const app = express();
// Set config as soon as possible so other modules can use them!
if (app.get('env') === 'development') {
    appconfig_1.ApplicationSettings.Config = appconfig_1.GetConfig(false);
}
else {
    appconfig_1.ApplicationSettings.Config = appconfig_1.GetConfig(true);
}
const path = require("path");
const parser = require("body-parser");
const cors = require("cors");
const index_1 = require("./routes/index");
const log_1 = require("./routes/log");
const database_1 = require("./SQLite/database");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// define request helpers
// THIS MUST HAPPEN BEFORE DEFINING ROUTES
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use(cors());
// Define routes and controllers here
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index_1.default);
app.use('/log', log_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
else {
    // production error handler
    // no stacktraces leaked to user
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}
// initialize database
let database = database_1.db;
// start listening
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
//# sourceMappingURL=app.js.map