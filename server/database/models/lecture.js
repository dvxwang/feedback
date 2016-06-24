'use strict';

module.exports = function (db) {

  db.define('lecture', {
    name: {
      type: Sequelize.STRING, 
      allowNull: false,
      validate: {notEmpty: true}
    },
    lecturer: {
      type: Sequelize.STRING, 
      allowNull: false,
      validate: {notEmpty: true}
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
