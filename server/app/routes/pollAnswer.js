'use strict';
var router = require('express').Router()
var db = require('../../database')
var PollAnswer = db.model('pollAnswer')
module.exports = router


router.post('/', (req, res, next) => {
  // pollId must be sent on body from front end
  PollAnswer.create(req.body)
  .then((answer) => {
    res.status(201).json(answer)
  })
  .catch(next)
})

router.get('/:pollId', (req, res, next) => {
  PollAnswer.findAll({where:{pollId: req.params.pollId}})
  .then((answers) => {
    res.json(answers)
  })
  .catch(next)
})

router.get('/:lectureId', (req, res, next) => {
  PollAnswer.findAll({where:{lectureId: req.params.lectureId}})
  .then((answers) => {
    res.json(answers)
  })
  .catch(next)
})
