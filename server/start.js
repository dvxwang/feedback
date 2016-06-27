'use strict';
var chalk = require('chalk');
var db = require('./database');

// Create a node server instance! cOoL!
var server = require('http').createServer();

var createApplication = function () {
    var app = require('./app')(db);
    server.on('request', app); // Attach the Express application.
    var io = require('socket.io')(server);   // Attach socket.io.

    io.on('connection', function(socket) {

        socket.on('addingQuestion', function(question) {
            io.emit('addQuestion', question)
        })

        socket.on('deletingQuestion', function(question) {
            io.emit('deleteQuestion', question)
        })

        socket.on('upvoting', function(question) {
            io.emit('receivedUpvote', question)
        })

        socket.on('downvoting', function(question) {
            io.emit('receivedDownvote', question)
        })
    })

};

var startServer = function () {
    var PORT = process.env.PORT || 1337;

    server.listen(PORT, function () {
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
    });

};

db.sync().then(createApplication).then(startServer).catch(function (err) {
    console.error(chalk.red(err.stack));
    process.kill(1);
});
