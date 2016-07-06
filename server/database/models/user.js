'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');

module.exports = function (db) {

    return db.define('user', {
        email: {
          type: Sequelize.STRING,
          allowNull: false
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        first_name: {
          type: Sequelize.STRING
        },
        last_name: {
          type: Sequelize.STRING
        },
        salt: {
          type: Sequelize.STRING
        },
        google_id: {
          type: Sequelize.STRING
        },
        facebook_id: {
          type: Sequelize.STRING
        },
        github_id: {
          type: Sequelize.STRING
        },
        isAdmin: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
    },
      {
        instanceMethods: {
          sanitize: function() {
            return _.omit(this.toJSON(), ['password', 'salt']);
          },
          correctPassword: function(candidatePassword) {
            return this.Model.encryptPassword(candidatePassword, this.salt) === this.password;
          },
          fakeCorrectPass: function(candidatePassword) {
            return this.password === candidatePassword
          },
          takeoutPassword: function() {
            this.password = "";
            return this
          }
        },
        classMethods: {
          generateSalt: function() {
            return crypto.randomBytes(16).toString('base64');
          },
          encryptPassword: function(plainText, salt) {
            var hash = crypto.createHash('sha1');
            hash.update(plainText);
            hash.update(salt);
            return hash.digest('hex')
          }
        },
        hooks: {
          beforeValidate: function(user) {
            if (user.changed('password')) {
              user.salt = user.Model.generateSalt();
              user.password = user.Model.encryptPassword(user.password, user.salt);
            }
          }
        }
      })
}
