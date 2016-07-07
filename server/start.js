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

        function gettingLecture() {socket.emit('getLecture', curLecture);
            console.log('huh', curLecture)
        };

        //question queue events
        socket.on('move', move);


        //lecture events
        socket.on('gettingLecture', gettingLecture);

        socket.on('getFeedback', function() {
          socket.emit('updateFeedback', 'Great', true);
          socket.emit('updateFeedback', 'Confused', true);
          socket.emit('updateFeedback', 'Example', true);
          socket.emit('updateFeedback', 'Cannot See', true);
          socket.emit('updateFeedback', 'Cannot Hear', true);
          socket.emit('updateFeedback', 'Request Break', true);
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
