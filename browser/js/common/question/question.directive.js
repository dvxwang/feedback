app.directive('question', function ($state, QuestionFactory) {

    return {
        restrict: 'E',
        scope: {
            
        },
        templateUrl: 'js/common/question/question.html',
        link: function(scope) {
        	QuestionFactory.getAllByLectureId(1).then(function(questions) {
        		scope.questions = questions
        	})
        }
    }
});
