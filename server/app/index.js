'use strict';
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

module.exports = function (db) {

    // Routes that will be accessed via AJAX should be prepended with
    // /api so they are isolated from our GET /* wildcard.


    app.use(express.static(path.join(__dirname, 'node_modules')));

    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


    app.use('/api', require('./routes'));

    var indexPath = path.join(__dirname, 'views', 'index.html');

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

    var rootPath = __dirname

    app.get('/*', function (req, res) {
        // res.json(rootPath)
        res.sendFile(indexPath);
    });

    // Error catching endware.
    app.use(function (err, req, res) {
        console.error(err);
        console.error(err.stack);
        res.status(err.status || 500).send(err.message || 'Internal server error.');
    });

    return app;

};
