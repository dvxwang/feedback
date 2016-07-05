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

        function addQuestion(question) {io.emit('addQuestion', question);}; //synergies for combining?
        function deleteQuestion(question){io.emit('deleteQuestion', question);}; //synergies for combining?
        function move(question,number) {io.emit('moving', question, number);};
        function upvoting(question) {io.emit('receivedUpvote', question);}; //synergies for combining?
        function downvoting(question) {io.emit('receivedDownvote', question);}; //synergies for combining?
        
        function submittedFeedback(category) {io.emit('updateFeedback', category);};
        function signalFeedbackRefresh() {io.emit('feedbackRefresh');};
        
        function sendPoll(poll) {io.emit('toStudent', poll);};
        function sendPollAnswer() {socket.broadcast.emit('updateActivePoll');}; //unsure about purpose, use io.emit?

        function lectureStart(lecture) {
            curLecture = lecture;
            io.emit('startLecture', lecture);
        };

        function lectureEnd() {
            curLecture = undefined;
            io.emit('endLecture');
        };
        function gettingLecture() {socket.emit('getLecture', curLecture);};

        //question queue events
        socket.on('addingQuestion', addingQuestion(question));
        socket.on('deletingQuestion', deleteQuestion(question));
        socket.on('move', move(question,number));
        socket.on('upvoting', upvoting(question));
        socket.on('downvoting', downvoting(question));
        
        //feedback events
        socket.on('submittedFeedback', submittedFeedback(category));
        socket.on('signalFeedbackRefresh', signalFeedbackRefresh());
        
        //poll events
        socket.on('pollOut', sendPoll(poll));
        socket.on('studentAnswer', sendPollAnswer());

        //lecture events
        socket.on('startingLecture', lectureStart(lecture));
        socket.on('endingLecture', lectureEnd());
        socket.on('gettingLecture', gettingLecture());
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
