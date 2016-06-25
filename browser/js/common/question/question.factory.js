app.factory('QuestionFactory', function ($http) {

	var obj = {};
	var cache = [];

	obj.getAllByLectureId = function(lectureId) {
		return $http.get('/api/question/lecture/' + lectureId).then(function(res) {
			angular.copy(res.data, cache);
			return cache;
		})
	}

	return obj;

});
