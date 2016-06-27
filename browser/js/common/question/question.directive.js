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
                }).map(function(q) {
                    return q.hasUpvoted = false;
                })
            })

            scope.submit = function() {
                if (scope.newQuestion) scope.questions.unshift({text: scope.newQuestion, submitTime: Date.now(), upvotes: 0})
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

            scope.upvote = function(question) {
                question.upvotes ? question.upvotes++ : question.upvotes = 1;
                question.hasUpvoted = !question.hasUpvoted;
            }

            scope.downvote = function(question) {
                question.upvotes--;
                question.hasUpvoted = !question.hasUpvoted;
            }

        }
    }
});
