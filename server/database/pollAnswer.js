'use strict';

var Sequelize = require('sequelize')

module.exports = function (db) {

  return db.define('poll', {
    question: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    options: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
      set: function (options) {
        options = options || [];
        if (typeof options === 'string') {
          options = options.split(' ').map(function (str) {
            return str.trim();
          });
        }
        this.setDataValue('options', options);
      }
    },
    correct: {
      type: Sequelize.STRING
    }
  })

}
