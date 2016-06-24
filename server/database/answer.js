'use strict';

var Sequelize = require('sequelize')

module.exports = function (db) {
  return db.define('poll_answer', {
    option: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })
}
