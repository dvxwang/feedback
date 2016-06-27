'use strict';

window.app = angular.module('MyApp', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngKookies']);

app.config(function ($urlRouterProvider, $locationProvider, $kookiesProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function () {
        window.location.reload();
    });

    $kookiesProvider.config.json = true;
});

app.config(function ($stateProvider) {
    $stateProvider.state('student', {
        url: '/student',
        templateUrl: 'js/views/student/student.html'
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: 'js/views/instructor/instructor.html'
    });
});

app.controller('LoginCtrl', function ($scope, $state) {

    console.log("reached login ctrl");
    $scope.loginStatus = function () {
        console.log("reached login status");
        var temp = $scope.login;
        console.log("temp: ", temp);

        if (temp === 'admin') {
            $state.go('admin');
        } else if (temp === 'student') {
            $state.go('student');
        }
    };
});

var socket = io(window.location.origin);

socket.on('connect', function () {});
app.controller('CreatePoll', function ($scope, $uibModal) {

    $scope.name = 'theNameHasBeenPassed';

    $scope.showModal = function () {

        $scope.opts = {
            backdrop: true,
            backdropClick: true,
            transclude: true,
            dialogFade: false,
            keyboard: true,
            templateUrl: 'js/common/createPollModal/createPollModal.html',
            controller: ModalInstanceCtrl,
            resolve: {} // empty storage
        };

        $scope.opts.resolve.item = function () {
            return angular.copy({ name: $scope.name, polls: $scope.polls }); // pass name to Dialog
        };

        var modalInstance = $uibModal.open($scope.opts);

        modalInstance.result.then(function () {
            //on ok button press
        }, function () {
            //on cancel button press
            console.log("Modal Closed");
        });
    };
});

var ModalInstanceCtrl = function ModalInstanceCtrl($scope, $uibModalInstance, $uibModal, item, PollFactory) {

    $scope.item = item;

    $scope.customOptions = function (option) {
        $scope.customShow = option === 'custom';
    };

    $scope.submitPoll = function () {
        var poll = {};
        poll.question = $scope.newPoll;
        poll.lectureId = 1;
        if ($scope.option == 'custom') poll.options = [$scope.a, $scope.b, $scope.c, $scope.d];
        PollFactory.createPoll(poll).then(function () {
            $uibModalInstance.close();
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};

app.directive('question', function ($state, QuestionFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/question/question.html',
        link: function link(scope) {
            QuestionFactory.getAllByLectureId(1).then(function (questions) {
                scope.questions = questions.filter(function (q) {
                    return q.status === 'open';
                }).map(function (q) {
                    return q.hasUpvoted = false;
                });
            });

            function findIndex(question) {
                for (var i = 0; i < scope.questions.length; i++) {
                    if (scope.questions[i].text === question.text) {
                        return i;
                    }
                }
                return -1;
            }

            scope.submit = function () {
                if (scope.newQuestion) {
                    var question = { text: scope.newQuestion, submitTime: Date.now(), upvotes: 0 };
                    socket.emit('addingQuestion', question);
                    scope.newQuestion = null;
                }
            };

            scope.delete = function (question) {
                socket.emit('deletingQuestion', question);
            };

            scope.store = function (question, status) {
                question.status = status;
                QuestionFactory.store(question).then(function () {
                    scope.delete(question);
                });
            };

            scope.upvote = function (question) {
                socket.emit('upvoting', question);
                question.hasUpvoted = !question.hasUpvoted;
            };

            scope.downvote = function (question) {
                socket.emit('downvoting', question);
                question.hasUpvoted = !question.hasUpvoted;
            };

            socket.on('addQuestion', function (question) {
                scope.questions.unshift(question);
                scope.$evalAsync();
            });

            socket.on('deleteQuestion', function (question) {
                var index = findIndex(question);
                scope.questions.splice(index, 1);
                scope.$evalAsync();
            });

            socket.on('receivedUpvote', function (question) {
                var index = findIndex(question);
                var q = scope.questions[index];
                q.upvotes ? q.upvotes++ : q.upvotes = 1;
                scope.$evalAsync();
            });

            socket.on('receivedDownvote', function (question) {
                var index = findIndex(question);
                var q = scope.questions[index];
                q.upvotes--;
                scope.$evalAsync();
            });
        }
    };
});

app.factory('QuestionFactory', function ($http) {

    var obj = {};

    obj.getAllByLectureId = function (lectureId) {
        return $http.get('/api/question/lecture/' + lectureId).then(function (res) {
            return res.data;
        });
    };

    obj.store = function (question) {
        return $http.post('/api/question', question).then(function (res) {
            return res.data;
        });
    };

    return obj;
});

app.directive('poll', function ($state, PollFactory) {
    return {
        restrict: 'E',
        scope: {
            useCtrl: "@"
        },
        templateUrl: 'js/common/poll/poll.html',
        link: function link(scope) {

            return PollFactory.getAllByLectureId(1).then(function (currentPolls) {
                scope.polls = currentPolls;
            });

            scope.deletePoll = function (id) {
                PollFactory.deletePoll(id);
            };
        }
    };
});

app.factory('PollFactory', function ($http) {
    function dotData(dot) {
        return dot.data;
    }
    var cachedPolls = [];
    return {
        getAllByLectureId: function getAllByLectureId(id) {
            return $http.get('/api/poll/lecture/' + id).then(dotData).then(function (polls) {
                cachedPolls = polls;
                return cachedPolls;
            });
        },
        getOneByPollId: function getOneByPollId(id) {
            return $http.get('/api/poll/' + id).then(dotData);
        },
        createPoll: function createPoll(pollObj) {
            return $http.post('/api/poll/', pollObj).then(dotData);
        },
        updatePoll: function updatePoll(pollObj, id) {
            return $http.put('/api/poll/' + id, pollObj).then(dotData);
        },
        deletePoll: function deletePoll(id) {
            return $http.delete('/api/poll/' + id).then(dotData).then(function (removedPoll) {
                cachedPolls.splice(cachedPolls.map(function (item) {
                    return item.id;
                }).indexOf(id), 1);
                return cachedPolls;
            });
        }
    };
});
