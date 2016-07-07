app.directive('question', function($state, QuestionFactory, LectureFactory) {

    return {
        restrict: 'E',
        scope: {
            admin: '@'
        },
        templateUrl: 'js/common/question/question.html',
        link: function(scope, element, attrs) {
            scope.lecture = scope.$parent.curLecture

            QuestionFactory.getAllByLectureId(scope.lecture.id)
            .then(function(questions) {
                scope.questions = questions.filter(function(q) { return q.status === 'open' }).reverse()
            })

            scope.submit = submit;
            scope.delete = deleteQuestion;
            scope.close = close;
            scope.move = emitMove;
            scope.vote = vote;

            // event listeners

            socket.on('addQuestion', renderAddQuestion);
            socket.on('deleteQuestion', renderDeleteQuestion);
            socket.on('voting', renderVote);
            socket.on('moving', renderMoveQuestion);

            // scope-related function declarations

            function vote(question, n) {
                question.hasUpvoted = !question.hasUpvoted;
                return QuestionFactory.update(question.id, { upvotes: question.upvotes + n });
            }

            function close(question) { return QuestionFactory.update(question.id, { status: 'closed'}) };
            
            function emitMove(question, n) { socket.emit('move', question, n) };
            
            function deleteQuestion(question) { return QuestionFactory.delete(question) };
            
            function submit() {
                if (scope.newQuestion) {
                    var question = { text: scope.newQuestion, submitTime: Date.now(), upvotes: 0, lectureId: scope.lecture.id };
                    return QuestionFactory.store(question).then(function(q) {
                        scope.newQuestion = null;
                    })
                }
            }

            // helper functions
            function findIndex(question) {
                for (var i = 0; i < scope.questions.length; i++) {
                    if (scope.questions[i].text === question.text) {
                        return i;
                    }
                }
                return -1;
            }

            // event-listener function declarations

            function rerender() { scope.$evalAsync() };
            
            function renderMoveQuestion(question, n) {
                var index = findIndex(question);
                if (index+n > -1 && index+n < scope.questions.length) {
                    scope.questions.splice(index, 1);
                    scope.questions.splice(index+n, 0, question);
                }
                rerender();
            };

            function renderVote(question) {
                var index = findIndex(question);
                scope.questions[index].upvotes = question.upvotes;
                rerender();
            }

            function renderDeleteQuestion(question) {
                var index = findIndex(question);
                scope.questions.splice(index, 1);
                rerender();
            }

            function renderAddQuestion(question) {
                scope.questions.unshift(question);
                if (scope.admin) {
                    var newNotification = new Notification("New Question", {body: question.text, tag: "question"});
                    setTimeout(newNotification.close.bind(newNotification), 2000);
                }
                rerender();
            }

        }
    }
});
