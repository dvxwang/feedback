app.directive('question', function($state, QuestionFactory, LectureFactory) {

    return {
        restrict: 'E',
        scope: {
            admin: '@'
        },
        templateUrl: 'js/common/question/question.html',
        link: function(scope, element, attrs) {
            scope.lecture = scope.$parent.curLecture

            QuestionFactory.getAllByLectureId(scope.lecture.id).then(function(questions) {
                scope.questions = questions.filter(function(q) { return q.status === 'open' }).reverse()
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
                var index = findIndex(question);
                if (index+n > -1 && index+n < scope.questions.length) {
                    scope.questions.splice(index, 1);
                    scope.questions.splice(index+n, 0, question);
                }
            }

            scope.submit = function() {
                if (scope.newQuestion) {
                    var question = {text: scope.newQuestion, submitTime: Date.now(), upvotes: 0, lectureId: scope.lecture.id};
                    return QuestionFactory.store(question).then(function(q) {
                        // socket.emit('addingQuestion', q);
                        scope.newQuestion = null;
                    })
                }
            }

            scope.delete = function(question) {
                // socket.emit('deletingQuestion', question);
                return QuestionFactory.delete(question);
            }

            scope.close = function(question) {
                return QuestionFactory.update(question.id, { status: 'closed'});
                // .then(function(){
                    // socket.emit('deletingQuestion', question);
                // })
            }

            scope.move = function(question, n) {
                socket.emit('move', question, n);
            }

            scope.upvote = function(question) {
                question.hasUpvoted = !question.hasUpvoted;
                socket.emit('upvoting', question);
                return QuestionFactory.update(question.id, { upvotes: question.upvotes+1 });
            }

            scope.downvote = function(question) {
                question.hasUpvoted = !question.hasUpvoted;
                socket.emit('downvoting', question);
                return QuestionFactory.update(question.id, { upvotes: question.upvotes-1 });
            }

            socket.on('addQuestion', function(question) {
                scope.questions.unshift(question);
                scope.$evalAsync();
            })

            socket.on('deleteQuestion', function(question) {
                var index = findIndex(question);
                scope.questions.splice(index, 1);
                scope.$evalAsync();
            })

            socket.on('receivedUpvote', function(question) {
                var index = findIndex(question);
                scope.questions[index].upvotes = question.upvotes + 1;
                scope.$evalAsync();
            })

            socket.on('receivedDownvote', function(question) {
                var index = findIndex(question);
                scope.questions[index].upvotes = question.upvotes - 1;
                scope.$evalAsync();
            })

            socket.on('moving', function(question, n) {
                move(question, n);
                scope.$evalAsync();
            })
        }
    }
});
