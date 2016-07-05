app.factory('PollAnswerFactory', ($http) => {
  function dotData(dot) {
    return dot.data;
  }
  var cachedAnswers = [];
  return {
    getAllByPollId: (id) => {
      return $http.get('/api/answer/'+id)
      .then(dotData)
      .then((answers) => {
        angular.copy(answers, cachedAnswers);
        return cachedAnswers;
      })
    },
    answerPoll: (pollObj) => {
      return $http.post('/api/answer/', pollObj)
      .then(dotData);
    }
  }
})
