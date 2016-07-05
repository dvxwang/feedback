app.factory('FeedbackFactory', function ($http) {
	var FeedbackFactory = {};

	FeedbackFactory.addFeedback = function (feedbackObj, lectureId) {
		return $http.post('/api/feedback/' + lectureId, feedbackObj)
	}

	FeedbackFactory.countFeedback = function (category, lectureId) {
		return $http.get('/api/feedback/count/'+lectureId+'/'+category)
		.then(function(result ) {
			console.log("Result data: ",result.data);
			return result.data;
		})
	}

	return FeedbackFactory
})