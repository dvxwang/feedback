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

router.post('/end', function (req, res, next) {
    Lecture.findById(req.body.id)
    .then(function(result){
        return result.update({
            endTime: req.body.endTime
        })
      })
    .then(function(result){
        req.session.destroy()
        res.send(result);
    });
});

module.exports = router;
