app.factory('PollFactory', ($http) => {
  function dotData(dot) {
    return dot.data
  }
  return {
    dotData: (dot) => {
      return dot.data
    },
    getAllByLectureId: (id) => {
      return $http.get('/api/poll/lecture/'+id)
      .then(dotData)
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
    }
  }
})
