app.factory('QuestionAnswerFactory', function ($http) {

	var obj = {};

	// factory property definitions;
	obj.create = create;

	// function declarations
	function resData(res) { return res.data };
	function create(answer, questionId) {
		return $http.post('/api/question-answer', { text: answer, questionId: questionId }).then(resData)
	} 

	return obj;

});
