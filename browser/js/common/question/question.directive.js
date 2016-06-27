app.directive('question', function($state, QuestionFactory) {

    return {
        restrict: 'E',
        scope: {
            
        },
        templateUrl: 'js/common/question/question.html',
        link: function(scope) {
            QuestionFactory.getAllByLectureId(1).then(function(questions) {
                scope.questions = questions.filter(function(q) {
                    return q.status === 'open'
                })
            })

            scope.submit = function() {
                if (scope.newQuestion) scope.questions.unshift({text: scope.newQuestion, submitTime: Date.now()})
                scope.newQuestion = null
            }

            scope.delete = function(question) {
                var index = scope.questions.indexOf(question)
                scope.questions.splice(index, 1)
            }

            scope.store = function(question, status) {
                question.status = status
                QuestionFactory.store(question).then(function(){
                    scope.delete(question)
                })
            }
        }
    }
});
