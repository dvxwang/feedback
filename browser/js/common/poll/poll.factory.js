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
    updatePoll: (pollObj) => {
      return $http.put('/api/poll/'+pollObj.id, pollObj)
      .then(dotData)
    },
    markSent: (pollObj) => {
      console.log("cached1", cachedPolls)
      return $http.put('/api/poll/mark/'+pollObj.id)
      .then(dotData)
      .then((sentPoll) => {
        cachedPolls.splice(cachedPolls.map(function(item) { return item.id }).indexOf(pollObj.id),1)
        console.log("cached2", cachedPolls)
        return cachedPolls
      })
    }
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
