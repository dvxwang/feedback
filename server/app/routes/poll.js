'use strict';

let router = require('express').Router();
let db = require('../../database');
let Poll = db.model('poll');
let PollAnswer = db.model('pollAnswer');
let Lecture = db.model('lecture');
module.exports = router;

router.param('pollId', (req, res, next, id) => {
  Poll.findOne({where:{id:id}, include: [{model:PollAnswer}]})
  .then((poll) => {
    if (!poll) res.sendStatus(404);
    req.poll = poll;
    next();
  })
  .catch(next);
});


router.get('/lecture/:lectureId', (req, res, next) => {

  let pendingPolls = Poll.findAll({
    where: {
      lectureId: req.params.lectureId,
      status: "pending"
    }
  });

  let favoritePolls = Poll.findAll({
    where: {
      status: "favorite"
    }
  });

  return Promise.all([pendingPolls, favoritePolls])
  .then((polls) => res.json(polls))
  .catch(next);
});

router.post('/', (req, res, next) => {
  Poll.create(req.body)
  .then((poll) => {
    req.app.get('socketio').emit('updatePolls');
    res.status(201).json(poll);
  }).catch(next);
});

router.get('/:pollId', (req, res, next) => {
  res.json(req.poll)
  .catch(next);
});

router.put('/:pollId', (req, res, next) => {
  let duplicate;
  if (req.poll.status === "favorite") {
    duplicate = Poll.create({
      question: req.poll.question,
      options: req.poll.options,
      status: "favorite"
    })
  }

  Promise.all([req.poll.updateAttributes(req.body), duplicate])
  .then((polls) => {
    let io = req.app.get('socketio');
    io.emit('toStudent', polls[0]);
    io.emit('updatePolls');
    io.emit('updateActivePoll');
    res.status(200).json(polls[0]);
  })
  .catch(next);
});


router.delete('/:pollId', (req, res, next) => {
  req.poll.destroy()
  .then(() => {
    req.app.get('socketio').emit('updatePolls');
    res.sendStatus(204);
  })
  .catch(next);
});
