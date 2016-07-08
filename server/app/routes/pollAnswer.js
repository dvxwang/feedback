'use strict';
let router = require('express').Router()
let db = require('../../database')
let PollAnswer = db.model('pollAnswer')
module.exports = router

router.post('/', (req, res, next) => {
  PollAnswer.create(req.body)
  .then((answer) => {
    req.app.get('socketio').emit('updateActivePoll')
    res.status(200).json(answer);
  })
  .catch(next);
})

router.get('/:pollId', (req, res, next) => {
  PollAnswer.findAll({where:{pollId: req.params.pollId}})
  .then((answers) => {
    res.json(answers);
  })
  .catch(next);
})

router.get('/:lectureId', (req, res, next) => {
  PollAnswer.findAll({where:{lectureId: req.params.lectureId}})
  .then((answers) => {
    res.json(answers)
  })
  .catch(next)
})
