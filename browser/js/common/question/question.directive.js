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

            function findIndex(question) {
                for (var i = 0; i < scope.questions.length; i++) {
                    if (scope.questions[i].text === question.text) {
                        return i;
                    }
                }
                return -1;
            }

            scope.submit = function() {
                if (scope.newQuestion) {
                    var question = {text: scope.newQuestion, submitTime: Date.now(), upvotes: 0}
                    socket.emit('addingQuestion', question)
                    scope.newQuestion = null;
                }
            }

            scope.delete = function(question) {
                socket.emit('deletingQuestion', question)
            }

            scope.store = function(question, status) {
                question.status = status
                QuestionFactory.store(question).then(function(){
                    scope.delete(question)
                })
            }

            scope.upvote = function(question) {
                socket.emit('upvoting', question)
                question.hasUpvoted = !question.hasUpvoted;
            }

            scope.downvote = function(question) {
                socket.emit('downvoting', question)
                question.hasUpvoted = !question.hasUpvoted;
            }

            socket.on('addQuestion', function(question) {
                scope.questions.unshift(question)
                scope.$evalAsync()
            })

            socket.on('deleteQuestion', function(question) {
                var index = findIndex(question)
                scope.questions.splice(index, 1)
                scope.$evalAsync()
            })

            socket.on('receivedUpvote', function(question) {
                var index = findIndex(question)
                var q = scope.questions[index]
                q.upvotes ? q.upvotes++ : q.upvotes = 1;
                scope.$evalAsync()
            })

            socket.on('receivedDownvote', function(question) {
                var index = findIndex(question)
                var q = scope.questions[index]
                q.upvotes--;
                scope.$evalAsync()
            })
        }
    }
});
