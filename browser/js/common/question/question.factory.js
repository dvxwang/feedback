app.factory('QuestionFactory', function ($http) {

	var obj = {};

	obj.getAllByLectureId = function(lectureId) {
		return $http.get('/api/question/lecture/' + lectureId).then(function(res) {
			return res.data
		})
	}

	return obj;

});
