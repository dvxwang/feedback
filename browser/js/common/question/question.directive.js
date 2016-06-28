app.directive('question', function($state, QuestionFactory) {

    return {
        restrict: 'E',
        scope: {
            admin: "@"
        },
        templateUrl: 'js/common/question/question.html',
        link: function(scope) {
            console.log(scope)
            QuestionFactory.getAllByLectureId(1).then(function(questions) {
                scope.questions = questions.filter(function(q) {
                    return q.status === 'open'
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

            function move(question, n) {
                var index = findIndex(question)
                if (index+n > -1 && index+n < scope.questions.length) {
                    scope.questions.splice(index, 1)
                    scope.questions.splice(index+n, 0, question)
                }
            }

            scope.submit = function() {
                if (scope.newQuestion) {
                    var question = {text: scope.newQuestion, submitTime: Date.now(), upvotes: 0}
                    return QuestionFactory.store(question).then(function(q) {
                        socket.emit('addingQuestion', q)
                        scope.newQuestion = null;
                    })
                }
            }

            scope.delete = function(question) {
                socket.emit('deletingQuestion', question)
                return QuestionFactory.delete(question)
            }

            scope.close = function(question) {
                question.status = 'closed'
                return QuestionFactory.update(question).then(function(){
                    socket.emit('deletingQuestion', question)
                })
            }

            scope.move = function(question, n) {
                socket.emit('move', question, n)
            }

            scope.upvote = function(question) {
                console.log("scope: ",scope);
                question.hasUpvoted = !question.hasUpvoted;
                question.upvotes++;
                socket.emit('upvoting', question)
                return QuestionFactory.update(question)
            }

            scope.downvote = function(question) {
                question.hasUpvoted = !question.hasUpvoted;
                question.upvotes--;
                socket.emit('downvoting', question)
                return QuestionFactory.update(question)
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
                var question = scope.questions[index]
                question.upvotes++
                scope.$evalAsync()
            })

            socket.on('receivedDownvote', function(question) {
                var index = findIndex(question)
                var question = scope.questions[index]
                question.upvotes--;
                scope.$evalAsync()
            })

            socket.on('moving', function(question, n) {
                move(question, n)
                scope.$evalAsync()
            })
        }
    }
});
