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
  Poll.findAll({where:{lectureId:req.params.lectureId}})
  .then((polls) => {
    res.json(polls)
  })
  .catch(next)
})

router.post('/', (req, res, next) => {
  Lecture.findOrCreate({where:{id:req.body.lectureId, name: "omri", lecturer: "omri"}})
  .then(() => {
    return Poll.create(req.body)
  })
  .then((poll) => {
    res.status(201).json(poll)
  })
})

router.get('/:pollId', (req, res, next) => {
  res.json(req.poll)
  .catch(next)
})

router.put('/:pollId', (req, res, next) => {
  req.poll.update(req.body)
  .then((poll) => {
    res.status(200).json(question)
  })
  .catch(next)
})

router.delete('/:pollId', (req, res, next) => {
  console.log(req.poll)
  req.poll.destroy()
  .then(() => {
    res.sendStatus(204)
  })
  .catch(next)
})