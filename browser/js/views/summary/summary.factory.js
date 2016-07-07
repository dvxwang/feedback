app.factory('SummaryFactory', function ($http) {

  var SummaryFactory = {}

  SummaryFactory.returnFeedBackJSON = (lectureId) => {
    return $http.get('/api/feedback/'+lectureId)
    .then((feedbacks) => {
      return feedbacks.map(function(feedback) {
        return {category: feedback.category, time: feedback.updatedAt}
      })
    })
  }

})
