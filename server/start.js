'use strict';
var chalk = require('chalk');
var db = require('./database');

// Create a node server instance! cOoL!
var server = require('http').createServer();

var createApplication = function () {
    var app = require('./app')(db);
    server.on('request', app); // Attach the Express application.
    var io = require('socket.io')(server);   // Attach socket.io.

    var questionQueue = [];

    io.on('connection', function(socket) {
        var id = socket.id;

        socket.on('addingQuestion', function(question) {
            questionQueue.push(question)
            io.emit('addQuestion', question)
        })

        socket.on('deletingQuestion', function(question) {
            io.emit('deleteQuestion', question)
        })

        socket.on('move', function(question, n) {
            io.emit('moving', question, n)
        })

        socket.on('upvoting', function(question) {
            socket.broadcast.emit('receivedUpvote', question)
        })

        socket.on('downvoting', function(question) {
            socket.broadcast.emit('receivedDownvote', question)
        })

        socket.on('pollOut', function(poll) {
          socket.broadcast.emit('toStudent', poll)
        })
        socket.on('submittedFeedback', function (category) {
            console.log('heard -->', category);
            io.emit('updateFeedback', category)
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
