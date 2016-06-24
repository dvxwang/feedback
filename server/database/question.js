'use strict';

var Sequelize = require('sequelize');

module.exports = function (db) {

    return db.define('question', {
        text: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        upvotes: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        status: {
            type: Sequelize.ENUM('open', 'closed'),
            defaultValue: 'open',
            allowNull: false,
        }
    });
};
