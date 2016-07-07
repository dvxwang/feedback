'use strict';
var path = require('path');
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/feedback');

require('./models/lecture')(db);
require('./models/question')(db);
require('./models/poll')(db);
require('./models/pollAnswer')(db);
require('./models/feedback')(db);
require('./models/user')(db);

var Lecture = db.model('lecture');
var Question = db.model('question');
var Poll = db.model('poll');
var PollAnswer = db.model('pollAnswer');
var Feedback = db.model('feedback');
var User = db.model('user');

User.hasMany(Lecture);
Lecture.hasMany(Question);
Lecture.hasMany(Poll);
Lecture.hasMany(Feedback);
Poll.hasMany(PollAnswer);

module.exports = db;
