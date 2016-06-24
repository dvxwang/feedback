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

router.get('/:lectureId', function (req, res, next) {
    Lecture.findById(req.params.id)
    .then(function(result){
        res.send(result);
    });
});

router.post('/start', function (req, res, next) {
    Lecture.create(req.body)
    .then(function(result){
        res.send(result);
    });
});

router.put('/end/:lectureId', function (req, res, next) {
    Lecture.findById(req.params.id)
    .then(function(result){
        return result.update({
            endTime: req.params.endTime
        })
      })
    .then(function(result){
        res.send(result);
    });
});

module.exports = router;
