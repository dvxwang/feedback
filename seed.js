var chalk = require('chalk');
const db = require('./server/database');
const Poll = db.model('poll');
const User = db.model('user');

var seedPolls = function () {

    var polls = [
        {
            question: 'Are you confused?',
            options: [
              'Yes',
              'No',
              'Sort of'
            ],
            status: "favorite",
        }
    ];

    return Poll.bulkCreate(polls);
};

var seedUsers = function() {

  var users = [
    {
      first_name: 'Admin',
      last_name: 'Istrator',
      email: 'admin@feedback.com',
      password: 'e0383ceff689de8200b360dafce2db9878dd0d3f',
      salt: 'HxU+DrlOTaQQGZVI3vUf1Q==',
      isAdmin: true
    }
  ]

  return User.bulkCreate(users);
}

db.sync({ force: true })
    .then(function () {
      return seedPolls()
    })
    .then(function () {
      return seedUsers()
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
