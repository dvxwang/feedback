'use strict';

var Sequelize = require('sequelize')

module.exports = function (db) {

  return db.define('lecture', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {notEmpty: true}
    },
    lecturer: {
      type: Sequelize.STRING
    },
    vidLink: {
      type: Sequelize.STRING,
    },
    startTime: {
      type: Sequelize.STRING,
    },
    endTime: {
      type: Sequelize.STRING,
    }
  });
};
