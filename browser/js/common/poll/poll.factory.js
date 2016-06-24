app.factory('PollFactory', ($http) => {
  return {
    getAllByLectureId: (id) => {
      return $http.get('/api/poll/lecture/'+id)
      .then((polls) => {
        return polls.data
      })
    }
  }
})
