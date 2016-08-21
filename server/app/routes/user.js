'use strict';

var router = require('express').Router();
var db = require('../../database');
var User = db.model('user');
module.exports = router;

router.param('userId', function (req, res, next, id) {
  User.findById(id)
  .then((user) => {
    if (!user) res.sendStatus(404);
    else req.user = user;
    next();
  }).catch(next);
})

router.get('/', function (req, res, next) {
    User.findAll()
    .then((users) => res.json(users))
    .catch(next);
})

router.get('/:userId', function (req, res, next) {
  res.json(req.user);
})

//Uncomment to allow user creation
// router.post('/', function (req, res, next) {
//   User.create(req.body)
//   .then((newUser) => {
//     req.user = newUser;
//     res.json(req.user);
//   }).catch(next)
// })

router.put('/:userId', function (req, res, next) {
  req.user.update(req.body)
  .then((user) => res.json(user))
  .catch(next);
})

router.delete('/:userId', function (req, res, next) {
  req.user.destroy()
  .then(() => res.sendStatus(204))
  .catch(next);
})