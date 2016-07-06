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

    app.set('socketio', io);

    io.on('connection', function(socket) {
        var id = socket.id;

        function move(question,number) {io.emit('moving', question, number);};
        function upvoting(question) {io.emit('receivedUpvote', question);}; //synergies for combining?
        function downvoting(question) {io.emit('receivedDownvote', question);}; //synergies for combining?

        function sendPollAnswer() {socket.broadcast.emit('updateActivePoll');}; //unsure about purpose, use io.emit?

        // function lectureStart(lecture) {
        //     curLecture = lecture;
        //     io.emit('startLecture', lecture);
        // };
        
        socket.on('startLecture', function (lecture) {
            console.log('LECTURE HERE ---->', lecture)
            curLecture = lecture
        })

        // function lectureEnd() {
        //     curLecture = undefined;
        //     io.emit('endLecture');
        // };
        function gettingLecture() {socket.emit('getLecture', curLecture);
            console.log('huh', curLecture)
        };

        //question queue events
        socket.on('move', move);
        socket.on('upvoting', upvoting);
        socket.on('downvoting', downvoting);

        //poll events
        socket.on('studentAnswer', sendPollAnswer);

        //lecture events
        // socket.on('startingLecture', lectureStart);
        // socket.on('endingLecture', lectureEnd);
        socket.on('gettingLecture', gettingLecture);

        socket.on('updatingPolls', function() {
          io.emit('updatePolls');
        });

        socket.on('getFeedback', function() {
          socket.emit('updateFeedback', 'Great')
          socket.emit('updateFeedback', 'Confused')
          socket.emit('updateFeedback', 'Example')
          socket.emit('updateFeedback', 'Cannot See')
          socket.emit('updateFeedback', 'Cannot Hear')
          socket.emit('updateFeedback', 'Request Break')
        });
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
