'use strict';
var chalk = require('chalk');
var db = require('./database');

// Create a node server instance! cOoL!
var server = require('http').createServer();

var createApplication = function () {
    var app = require('./app')(db);
    server.on('request', app); // Attach the Express application.
    var io = require('socket.io')(server);   // Attach socket.io.

    app.set('socketio', io);

    io.on('connection', function(socket) {
        var id = socket.id;

        function move(question,number) {io.emit('moving', question, number);};

        //question queue events
        socket.on('move', move);


        //lecture events
        socket.on('getFeedback', function() {
          socket.emit('updateFeedback', 'great', true);
          socket.emit('updateFeedback', 'confused', true);
          socket.emit('updateFeedback', 'example', true);
          socket.emit('updateFeedback', 'see', true);
          socket.emit('updateFeedback', 'hear', true);
          socket.emit('updateFeedback', 'break', true);
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
