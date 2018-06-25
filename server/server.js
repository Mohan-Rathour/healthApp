/**
 * Created by.
 */
'use strict';
let express = require("express"),
    path = require("path"),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    app = express(),
    config = require('./config/dev'),
    healthController = require('./src/controller/healthController');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, "../app/dist")));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-type,Accept,X-Access-Token,X-Key');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.get('/', function (req, res) {
    res.send({
        status: 200,
        message: 'OK'
    });
    res.end();
});

app.get('/api/healthReport', healthController.generateReport);
app.get('/api/downloadReport', healthController.downloadReport);

app.use(function (req, res, next) {
    err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
app.set('port', config.port || 3000);
app.listen(app.get('port'), function () {
    console.log("Started listening on port", app.get('port'));
});