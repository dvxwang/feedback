app.directive('question', function($state, QuestionFactory) {

    return {
        restrict: 'E',
        scope: {
            
        },
        templateUrl: 'js/common/question/question.html',
        link: function(scope) {
            scope.questions = [
                { text: "What is life?"},
                { text: "What is death?"},
                { text: "What is code?"},
            ]

            scope.submitQuestion = function() {
                if (scope.newQuestion) scope.questions.unshift({text: scope.newQuestion})
                scope.newQuestion = null
            }

            scope.deleteQuestion = function(question) {
                var index = scope.questions.indexOf(question)
                scope.questions.splice(index, 1)
            }
        }
    }
});
