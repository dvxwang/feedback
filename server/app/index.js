'use strict';
var path = require('path');
var express = require('express');
var session = require('express-session')
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

module.exports = function (db) {

    // static middleware
    var rootPath = path.join(__dirname, '../../');
    app.use(express.static(path.join(rootPath, 'public')));
    app.use(express.static(path.join(rootPath, 'node_modules')));
    app.use(express.static(path.join(rootPath, 'browser')));

    // parsing middleware
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    app.use(cookieParser());

    app.use(session({secret: 'feedme'}))

    // authentication goes here
    // app.use(require('./auth'))

    app.use('/api', require('./routes'));

    /*
     This middleware will catch any URLs resembling a file extension
     for example: .js, .html, .css
     This allows for proper 404s instead of the wildcard '/*' catching
     URLs that bypass express.static because the given file does not exist.
     */
    app.use(function (req, res, next) {

        if (path.extname(req.path).length > 0) {
            res.status(404).end();
        } else {
            next(null);
        }

    });

    // Routes that will be accessed via AJAX should be prepended with
    // /api so they are isolated from our GET /* wildcard.
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'views', 'index.html'));
    });

    // Error catching endware.
    app.use(function (err, req, res) {
        console.error(err);
        console.error(err.stack);
        res.status(err.status || 500).send(err.message || 'Internal server error.');
    });

    return app;

};
