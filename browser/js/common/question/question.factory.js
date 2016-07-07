app.factory('QuestionFactory', function ($http) {

	var obj = {};

	// factory property definitions;
	obj.getAllByLectureId = getAllByLectureId;
	obj.store = storeQuestion;
	obj.update = updateQuestion;
	obj.delete = deleteQuestion;

	// function declarations
	function resData(res) { return res.data };
	function getAllByLectureId(lectureId) { return $http.get('/api/question/lecture/' + lectureId).then(resData) };
	function storeQuestion(question) { return $http.post('/api/question', question).then(resData) };
	function updateQuestion(questionId, update) { return $http.put('/api/question/' + questionId, update).then(resData) };
	function deleteQuestion(question) { return $http.delete('/api/question/' + question.id).then(resData) };

	return obj;

});
