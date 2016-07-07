app.factory('PollAnswerFactory', ($http) => {
  let PollAnswerFactory = {};
  let cachedAnswers = [];

  function dotData(dot) {
    return dot.data;
  }

  function setCache(answers) {
    angular.copy(answers, cachedAnswers);
    return cachedAnswers
  }

  PollAnswerFactory.getAllByPollId = (id) => {
    return $http.get('/api/answer/'+id)
    .then(dotData)
    .then(setCache)
  }

  PollAnswerFactory.answerPoll = (pollObj) => {
    return $http.post('/api/answer/', pollObj)
    .then(dotData);
  }

  return PollAnswerFactory
})
