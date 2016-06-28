app.factory('FeedbackFactory', function ($http) {
	var FeedbackFactory = {};

	FeedbackFactory.addFeedback = function (category) {
		return $http.post('/api/feedback/', {category: category})
		.then(function(result) {
		})
	}

	FeedbackFactory.countFeedback = function (category) {
		return $http.get('/api/feedback/count/'+ category)
		.then(function(result ) {
			return result.data
		})
	}

	return FeedbackFactory
})