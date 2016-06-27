app.factory('PollFactory', ($http) => {
  function dotData(dot) {
    return dot.data
  }
  var cachedPolls = []
  return {
    getAllByLectureId: (id) => {
      return $http.get('/api/poll/lecture/'+id)
      .then(dotData)
      .then((polls) => {
        angular.copy(polls, cachedPolls)
        return cachedPolls
      })
    },
    getOneByPollId: (id) => {
      return $http.get('/api/poll/'+id)
      .then(dotData)
    },
    createPoll: (pollObj) => {
      return $http.post('/api/poll/', pollObj)
      .then(dotData)
    },
    updatePoll: (pollObj, id) => {
      return $http.put('/api/poll/'+id, pollObj)
      .then(dotData)
    },
    deletePoll: (id) => {
      return $http.delete('/api/poll/'+id)
      .then(dotData)
      .then((removedPoll) => {
        cachedPolls.splice(cachedPolls.map(function(item) { return item.id }).indexOf(id),1)
        return cachedPolls
      })
    }
  }
})
