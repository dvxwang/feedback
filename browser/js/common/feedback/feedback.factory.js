app.factory('FeedbackFactory', function ($http) {
	var FeedbackFactory = {};

	FeedbackFactory.addFeedback = function (category, lectureId, resetComment) {
		return $http.post('/api/feedback/' + lectureId,
			{
			category: category,
			comment: resetComment
			}
		)
	}

	FeedbackFactory.countFeedback = function (category, lectureId) {
		return $http.get('/api/feedback/count/'+lectureId+'/'+category)
		.then(function(result ) {
			return result.data
		})
	}

	return FeedbackFactory
})