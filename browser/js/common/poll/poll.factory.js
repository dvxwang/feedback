app.factory('PollFactory', ($http) => {
  function dotData(dot) {
    return dot.data
  }
  function cleanCache(arr, id) {
    arr.splice(arr.map(function(item) { return item.id }).indexOf(id),1)
  }
  var cachedPolls = { pending: [], favorite: [] }
  return {
    getAllByLectureId: (id) => {
      return $http.get('/api/poll/lecture/'+id)
      .then(dotData)
      .then((polls) => {
        console.log(polls)
        var pendingPolls = polls[0]
        var favoritePolls = polls[1]
        angular.copy(pendingPolls, cachedPolls.pending)
        angular.copy(favoritePolls, cachedPolls.favorite)
        return cachedPolls
      })
    },
    getOneByPollId: (id) => {
      return $http.get('/api/poll/'+id)
      .then(dotData);
    },
    createPoll: (pollObj) => {
      return $http.post('/api/poll/', pollObj)
      .then(dotData)
      .then((poll) => {
        if (poll.status !== "sent") cachedPolls[poll.status].push(poll)
        return poll
      })
    },
    updatePoll: (poll, pollObj) => {
      if (poll.status === "pending") cleanCache(cachedPolls[poll.status], poll.id)
      return $http.put('/api/poll/'+poll.id, pollObj)
      .then(dotData)
    },
    deletePoll: (poll) => {
      cleanCache(cachedPolls[poll.status], poll.id)
      return $http.delete('/api/poll/'+poll.id)
      .then(dotData)
    }
  }
})
