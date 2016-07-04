'use strict';
var router = require('express').Router()
var db = require('../../database')
var Poll = db.model('poll')
var PollAnswer = db.model('pollAnswer')
var Lecture = db.model('lecture')
module.exports = router


// should we have all routes prefaced with lecture/:lectureId ?
router.param('pollId', (req, res, next, id) => {
  Poll.findOne({where:{id:id}, include: [{model:PollAnswer}]})
  .then((poll) => {
    if (!poll) res.sendStatus(404)
    req.poll = poll
    next()
  })
  .catch(next)
})

router.get('/lecture/:lectureId', (req, res, next) => {
  Poll.findAll({where:{lectureId:req.params.lectureId, sent: "pending"}})
  .then((polls) => {
    res.json(polls)
  })
  .catch(next)
})

router.post('/', (req, res, next) => {
  Poll.create(req.body)
  .then((poll) => {
    res.status(201).json(poll)
  })
})

router.get('/:pollId', (req, res, next) => {
  res.json(req.poll)
  .catch(next)
})

router.put('/:pollId', (req, res, next) => {
  req.poll.updateAttributes(req.body)
  .then((poll) => {
    res.status(200).json(poll)
  })
  .catch(next)
})


router.delete('/:pollId', (req, res, next) => {
  req.poll.destroy()
  .then(() => {
    res.sendStatus(204)
  })
  .catch(next)
})
