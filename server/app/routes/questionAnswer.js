'use strict';
let router = require('express').Router()
let db = require('../../database')
let QuestionAnswer = db.model('questionAnswer')
module.exports = router

router.post('/', (req, res, next) => {
  QuestionAnswer.create(req.body)
  .then((answer) => {
    //req.app.get('socketio').emit('updateQA')
    res.status(201).json(answer);
  }).catch(next);
})