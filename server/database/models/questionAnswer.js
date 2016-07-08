'use strict';

var Sequelize = require('sequelize')

module.exports = function (db) {
  return db.define('questionAnswer', {
    text: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  })
}
