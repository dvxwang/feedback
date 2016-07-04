app.factory('PollFactory', ($http) => {
  function dotData(dot) {
    return dot.data
  }
  function cleanCache(arr, id) {
    arr.splice(arr.map(function(item) { return item.id }).indexOf(id),1)
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
      .then((poll) => {
        cachedPolls.push(poll)
        return poll
      })
    },
    updatePoll: (pollId, pollObj) => {
      return $http.put('/api/poll/'+pollId, pollObj)
      .then(dotData)
      .then((poll) => {
        if (poll.status === "sent") cleanCache(cachedPolls, poll.id)
        return poll
      })
    },
    deletePoll: (id) => {
      return $http.delete('/api/poll/'+id)
      .then(dotData)
      .then((removedPoll) => {
        cleanCache(cachedPolls, id)
        return cachedPolls
      })
    }
  }
})
