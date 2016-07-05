var chalk = require('chalk');
const db = require('./server/database');
const Poll = db.model('poll');

var seedPolls = function () {

    var polls = [
        {
            question: 'Are you like, totally confused?',
            options: [
              'Yes',
              'No',
              'Sort of'
            ],
            status: "favorite",
            //lectureId: scope.curLecture.id
        }
    ];

    return Poll.bulkCreate(polls);
};

db.sync({ force: true })
    .then(function () {
      return seedPolls()
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
