app.factory('PollFactory', ($http) => {
  return {
    getAllByLectureId: (id) => {
      return $http.get('/api/poll/lecture/'+id)
      .then((polls) => {
        return polls.data
      })
    },
    getOneByPollId: (id) => {
      return $http.get('/api/poll/'+id)
      .then((poll) => {
        return poll.data
      })
    },
    createPoll: (pollObj) => {
      return $http.post('/api/poll/', pollObj)
      .then((newPoll) => {
        return newPoll.data
      })
    },
    updatePoll: (pollObj, id) => {
      return $http.put('/api/poll/'+id, pollObj)
      .then((updatedPoll) => {
        return updatedPoll.data
      })
    }
  }
})
