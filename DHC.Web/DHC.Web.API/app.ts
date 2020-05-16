import debug = require('debug');
import express = require('express');
import path = require('path');
import parser = require('body-parser');
import cors = require('cors');

import routes from './routes/index';
import log from './routes/log';
import { Console } from 'console';
import { db } from './SQLite/database';

const app = express();

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
app.use('/', routes);
app.use('/log', log);

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
    app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

// initialize database
let database: any = db;

// start listening
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
