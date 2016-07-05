app.factory('QuestionFactory', function ($http) {

	var obj = {};

	obj.getAllByLectureId = function(lectureId) {
		return $http.get('/api/question/lecture/' + lectureId).then(function(res) {
			return res.data;
		})
	};

	obj.store = function(question) {
		return $http.post('/api/question', question).then(function(res) {
			// socket.emit('addingQuestion', q);
			return res.data;
		})
	};

	obj.update = function(questionId, update) {
		return $http.put('/api/question/' + questionId, update)
		.then(function(res) {
			// if (update.status==='closed') socket.emit('deletingQuestion', res.data);
			return res.data;
		});
	};

	obj.delete = function(question) {
		return $http.delete('/api/question/' + question.id).then(function(res) {
			// socket.emit('deletingQuestion', question);
			return res.data;
		})
	};

	return obj;

});
