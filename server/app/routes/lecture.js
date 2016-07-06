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

router.get('/instructor/active', function (req, res, next) {
  Lecture.findAll({where: {userId: req.user.id, endTime: null}})
  .then(function(lectures) {
    res.json(lectures)
  })
})

router.get('/instructor/past', function (req, res, next) {
  Lecture.findAll({where: {userId: req.user.id, endTime: {$ne: null}}})
  .then(function(lectures) {
    res.json(lectures)
  })
})

router.get('/current', function (req, res, next) {
    res.send(req.session.lecture)
});

router.get('/:lectureId', function (req, res, next) {
    Lecture.findById(req.params.lectureId)
    .then(function(result){
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
});

router.put('/start', function(req, res, next) {
  Lecture.findById(req.body.id)
  .then(function(lecture) {
    return lecture.update({startTime: req.body.startTime})
  })
  .then(function(updatedLecture) {
    res.status(201).json(updatedLecture)
  });
});

router.put('/end', function (req, res, next) {
  Lecture.findById(req.body.id)
  .then(function(result){
    return result.update({
      endTime: Math.floor(Date.now()/1000)
    })
  })
  .then(function(lecture){
    res.json(lecture);
  });
});


module.exports = router;
