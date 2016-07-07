moment().format()

app.factory('SummaryFactory', function ($http) {

  var SummaryFactory = {}

  function dotData(dot) {
    return dot.data
  }

  SummaryFactory.returnFeedBackJSON = (lectureId) => {
    return $http.get('/api/feedback/summary/'+lectureId)
    .then(dotData)
    .then((feedbacks) => {
      return feedbacks.map(function(feedback) {
        return {time: moment(feedback.updatedAt).unix(), category: feedback.category}
      })
    })
  }

  return SummaryFactory

})
