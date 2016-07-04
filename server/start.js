'use strict';
var chalk = require('chalk');
var db = require('./database');

// Create a node server instance! cOoL!
var server = require('http').createServer();

var createApplication = function () {
    var app = require('./app')(db);
    server.on('request', app); // Attach the Express application.
    var io = require('socket.io')(server);   // Attach socket.io.

    var curLecture;

    io.on('connection', function(socket) {
        var id = socket.id;

        socket.on('addingQuestion', function(question) {
            io.emit('addQuestion', question)
        })

        socket.on('deletingQuestion', function(question) {
            io.emit('deleteQuestion', question)
        })

        socket.on('move', function(question, n) {
            io.emit('moving', question, n)
        })

        socket.on('upvoting', function(question) {
            io.emit('receivedUpvote', question)
        })

        socket.on('downvoting', function(question) {
            io.emit('receivedDownvote', question)
        })

        socket.on('submittedFeedback', function (category) {
            io.emit('updateFeedback', category)
        })

        socket.on('pollOut', function(poll) {
          io.emit('toStudent', poll)
        })

        socket.on('studentAnswer', function() {
          socket.broadcast.emit('updateActivePoll')
        })

        socket.on('startingLecture', function(lecture) {
          curLecture = lecture;
          io.emit('startLecture', lecture);
        })

        socket.on('endingLecture', function() {
          curLecture = undefined;
          io.emit('endLecture')
        })
        
        socket.on('signalFeedbackRefresh', function() {
          io.emit('feedbackRefresh')
        })

        socket.on('gettingLecture', function() {
          socket.emit('getLecture', curLecture)
        })

        socket.on('getFeedback', function() {
          socket.emit('updateFeedback', 'Great')
          socket.emit('updateFeedback', 'Confused')
          socket.emit('updateFeedback', 'Example')
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
