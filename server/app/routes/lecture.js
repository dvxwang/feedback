'use strict';
var router = require('express').Router();
var db = require('../../database');
var Lecture = db.model('lecture');

router.get('/', function (req, res, next) {
    Lecture.findAll()
    .then(function(result){
        res.send(result);
    });
});

router.get('/instructor', function (req, res, next) {
  console.log("USER", req.user.id)
  Lecture.findAll({where: {userId: req.user.id}})
  .then(function(lectures) {
    res.json(lectures)
  })
})

router.get('/current', function (req, res, next) {
    res.send(req.session.lecture)
});

router.get('/:lectureId', function (req, res, next) {
    Lecture.findById(req.params.id)
    .then(function(result){
        res.send(result);
    });
});

router.post('/start', function (req, res, next) {
    Lecture.create(req.body)
    .then(function(result){
        req.session.lecture = result
        res.send(result);
    });
});

router.post('/create', function(req, res, next) {
  req.body.userId = req.user.id
  Lecture.create(req.body)
  .then(function(result){
      req.session.lecture = result
      res.send(result);
  });
})

router.post('/end', function (req, res, next) {
    Lecture.findById(req.session.lecture.id)
    .then(function(result){
        return result.update({
            endTime: Math.floor(Date.now()/1000)
        })
      })
    .then(function(result){
        req.session.destroy()
        res.send(result);
    });
});

module.exports = router;
