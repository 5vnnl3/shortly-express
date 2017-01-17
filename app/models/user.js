var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');



var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function() {
    this.on('creating', this.hashPassword);
    this.comparePasswords = function(attemptedPassword, callback) {
      bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
        console.log('err', err, 'isMatch', isMatch);
        callback(err, isMatch);
      });
    };
  },
    // this.on('fetching', function(model, attrs, options) {
    //   console.log('password or hash?', model.get('password'));
    //   return bcrypt.compare(model.attributes.password, model.get('password'), function(err, res) {
    //     if (err) {
    //       console.error('password doesn\'t match', err);
    //     }
    //   });
    // });

  // -----------copied
  hashPassword: function() {
    var cipher = Promise.promisify(bcrypt.hash);
    // return a promise - bookshelf will wait for the promise
    // to resolve before completing the create action
    return cipher(this.get('password'), null, null)
     .bind(this)
     .then(function(hash) {
       this.set('password', hash);
     });
  }
});

module.exports = User;