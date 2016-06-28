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
    console.log("Start reached");
    Lecture.create(req.body)
    .then(function(result){
        // console.log("Result: ",result);
        res.send(result);
    });
});

router.post('/end', function (req, res, next) {
    console.log("End reached: ",req.body);
    Lecture.findById(req.body.id)
    .then(function(result){
        console.log("result: ",result);
        return result.update({
            endTime: req.body.endTime
        })
      })
    .then(function(result){
        res.send(result);
    });
});

module.exports = router;
