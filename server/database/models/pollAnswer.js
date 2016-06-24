'use strict';

var Sequelize = require('sequelize')

module.exports = function (db) {
  return db.define('pollAnswer', {
    option: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })
}
