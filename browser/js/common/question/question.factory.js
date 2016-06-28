app.factory('QuestionFactory', function ($http) {

	var obj = {};

	obj.getAllByLectureId = function(lectureId) {
		return $http.get('/api/question/lecture/' + lectureId).then(function(res) {
			return res.data;
		})
	}

	obj.store = function(question) {
		return $http.post('/api/question', question).then(function(res) {
			return res.data;
		})
	}

	obj.update = function(question) {
		return $http.put('/api/question/' + question.id, question).then(function(res) {
			return res.data;
		})
	}

	obj.delete = function(question) {
		return $http.delete('/api/question/' + question.id).then(function(res) {
			return res.data;
		})
	}

	return obj;

});
