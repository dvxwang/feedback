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
app.directive('poll', function ($state, PollFactory) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/poll/poll.html',
        link: function link(scope) {
            PollFactory.getAllByLectureId(1).then(function (polls) {
                scope.polls = polls;
            });
        }
    };
});

app.factory('PollFactory', function ($http) {
    function dotData(dot) {
        return dot.data;
    }
    return {
        dotData: function dotData(dot) {
            return dot.data;
        },
        getAllByLectureId: function getAllByLectureId(id) {
            return $http.get('/api/poll/lecture/' + id).then(dotData);
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
            return $http.delete('/api/poll/' + id).then(dotData);
        }
    };
});

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInNvY2tldC5qcyIsImNvbW1vbi9wb2xsL3BvbGwuZGlyZWN0aXZlLmpzIiwiY29tbW9uL3BvbGwvcG9sbC5mYWN0b3J5LmpzIiwiY29tbW9uL3F1ZXN0aW9uL3F1ZXN0aW9uLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9xdWVzdGlvbi9xdWVzdGlvbi5mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE9BQUEsR0FBQSxHQUFBLFFBQUEsTUFBQSxDQUFBLE9BQUEsRUFBQSxDQUFBLFdBQUEsRUFBQSxjQUFBLEVBQUEsV0FBQSxFQUFBLFdBQUEsQ0FBQSxDQUFBOztBQUVBLElBQUEsTUFBQSxDQUFBLFVBQUEsa0JBQUEsRUFBQSxpQkFBQSxFQUFBLGdCQUFBLEVBQUE7O0FBRUEsc0JBQUEsU0FBQSxDQUFBLElBQUE7O0FBRUEsdUJBQUEsU0FBQSxDQUFBLEdBQUE7O0FBRUEsdUJBQUEsSUFBQSxDQUFBLGlCQUFBLEVBQUEsWUFBQTtBQUNBLGVBQUEsUUFBQSxDQUFBLE1BQUE7QUFDQSxLQUZBOztBQUlBLHFCQUFBLE1BQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQTtBQUVBLENBWkE7O0FBY0EsSUFBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxtQkFBQSxLQUFBLENBQUEsU0FBQSxFQUFBO0FBQ0EsYUFBQSxVQURBO0FBRUEscUJBQUE7QUFGQSxLQUFBO0FBSUEsQ0FMQTs7QUFPQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLG1CQUFBLEtBQUEsQ0FBQSxPQUFBLEVBQUE7QUFDQSxhQUFBLFFBREE7QUFFQSxxQkFBQTtBQUZBLEtBQUE7QUFJQSxDQUxBOztBQU9BLElBQUEsVUFBQSxDQUFBLFdBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUE7O0FBRUEsWUFBQSxHQUFBLENBQUEsb0JBQUE7QUFDQSxXQUFBLFdBQUEsR0FBQSxZQUFBO0FBQ0EsZ0JBQUEsR0FBQSxDQUFBLHNC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QWxCQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG53aW5kb3cuYXBwID0gYW5ndWxhci5tb2R1bGUoJ015QXBwJywgWyd1aS5yb3V0ZXInLCAndWkuYm9vdHN0cmFwJywgJ25nQW5pbWF0ZScsICduZ0tvb2tpZXMnXSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRrb29raWVzUHJvdmlkZXIpIHtcbiAgICAvLyBUaGlzIHR1cm5zIG9mZiBoYXNoYmFuZyB1cmxzICgvI2Fib3V0KSBhbmQgY2hhbmdlcyBpdCB0byBzb21ldGhpbmcgbm9ybWFsICgvYWJvdXQpXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgIC8vIElmIHdlIGdvIHRvIGEgVVJMIHRoYXQgdWktcm91dGVyIGRvZXNuJ3QgaGF2ZSByZWdpc3RlcmVkLCBnbyB0byB0aGUgXCIvXCIgdXJsLlxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbiAgICAvLyBUcmlnZ2VyIHBhZ2UgcmVmcmVzaCB3aGVuIGFjY2Vzc2luZyBhbiBPQXV0aCByb3V0ZVxuICAgICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcvYXV0aC86cHJvdmlkZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KTtcblxuICAgICRrb29raWVzUHJvdmlkZXIuY29uZmlnLmpzb24gPSB0cnVlO1xuXG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc3R1ZGVudCcsIHtcbiAgICAgICAgdXJsOiAnL3N0dWRlbnQnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3ZpZXdzL3N0dWRlbnQvc3R1ZGVudC5odG1sJyxcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbicsIHtcbiAgICAgICAgdXJsOiAnL2FkbWluJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy92aWV3cy9pbnN0cnVjdG9yL2luc3RydWN0b3IuaHRtbCcsXG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSkge1xuXG5cdGNvbnNvbGUubG9nKFwicmVhY2hlZCBsb2dpbiBjdHJsXCIpO1xuXHQkc2NvcGUubG9naW5TdGF0dXMgPSBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKFwicmVhY2hlZCBsb2dpbiBzdGF0dXNcIik7XG5cdFx0dmFyIHRlbXAgPSAkc2NvcGUubG9naW47XG5cdFx0Y29uc29sZS5sb2coXCJ0ZW1wOiBcIix0ZW1wKTtcblxuXHRcdGlmICh0ZW1wPT09J2FkbWluJyl7XG5cdFx0XHQkc3RhdGUuZ28oJ2FkbWluJyk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHRlbXA9PT0nc3R1ZGVudCcpe1xuXHRcdFx0JHN0YXRlLmdvKCdzdHVkZW50Jyk7XG5cdFx0fVxuXHR9XG5cbn0pO1xuIiwidmFyIHNvY2tldCA9IGlvKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xuXG5zb2NrZXQub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbigpIHtcbiAgICBcbn0pIiwiYXBwLmRpcmVjdGl2ZSgncG9sbCcsICgkc3RhdGUsIFBvbGxGYWN0b3J5KSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZToge1xuXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9wb2xsL3BvbGwuaHRtbCcsXG4gICAgbGluazogKHNjb3BlKSA9PiB7XG4gICAgICBQb2xsRmFjdG9yeS5nZXRBbGxCeUxlY3R1cmVJZCgxKVxuICAgICAgLnRoZW4oKHBvbGxzKSA9PiB7XG4gICAgICAgIHNjb3BlLnBvbGxzID0gcG9sbHNcbiAgICAgIH0pXG4gICAgfVxuICB9XG59KVxuIiwiYXBwLmZhY3RvcnkoJ1BvbGxGYWN0b3J5JywgKCRodHRwKSA9PiB7XG4gIGZ1bmN0aW9uIGRvdERhdGEoZG90KSB7XG4gICAgcmV0dXJuIGRvdC5kYXRhXG4gIH1cbiAgcmV0dXJuIHtcbiAgICBkb3REYXRhOiAoZG90KSA9PiB7XG4gICAgICByZXR1cm4gZG90LmRhdGFcbiAgICB9LFxuICAgIGdldEFsbEJ5TGVjdHVyZUlkOiAoaWQpID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvcG9sbC9sZWN0dXJlLycraWQpXG4gICAgICAudGhlbihkb3REYXRhKVxuICAgIH0sXG4gICAgZ2V0T25lQnlQb2xsSWQ6IChpZCkgPT4ge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9wb2xsLycraWQpXG4gICAgICAudGhlbihkb3REYXRhKVxuICAgIH0sXG4gICAgY3JlYXRlUG9sbDogKHBvbGxPYmopID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3BvbGwvJywgcG9sbE9iailcbiAgICAgIC50aGVuKGRvdERhdGEpXG4gICAgfSxcbiAgICB1cGRhdGVQb2xsOiAocG9sbE9iaiwgaWQpID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvcG9sbC8nK2lkLCBwb2xsT2JqKVxuICAgICAgLnRoZW4oZG90RGF0YSlcbiAgICB9LFxuICAgIGRlbGV0ZVBvbGw6IChpZCkgPT4ge1xuICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS9wb2xsLycraWQpXG4gICAgICAudGhlbihkb3REYXRhKVxuICAgIH1cbiAgfVxufSlcbiIsImFwcC5kaXJlY3RpdmUoJ3F1ZXN0aW9uJywgZnVuY3Rpb24oJHN0YXRlLCBRdWVzdGlvbkZhY3RvcnkpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vcXVlc3Rpb24vcXVlc3Rpb24uaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICAgICAgICBRdWVzdGlvbkZhY3RvcnkuZ2V0QWxsQnlMZWN0dXJlSWQoMSkudGhlbihmdW5jdGlvbihxdWVzdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBzY29wZS5xdWVzdGlvbnMgPSBxdWVzdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKHEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHEuc3RhdHVzID09PSAnb3BlbidcbiAgICAgICAgICAgICAgICB9KS5tYXAoZnVuY3Rpb24ocSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcS5oYXNVcHZvdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmRJbmRleChxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NvcGUucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5xdWVzdGlvbnNbaV0udGV4dCA9PT0gcXVlc3Rpb24udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUubmV3UXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0ge3RleHQ6IHNjb3BlLm5ld1F1ZXN0aW9uLCBzdWJtaXRUaW1lOiBEYXRlLm5vdygpLCB1cHZvdGVzOiAwfVxuICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnYWRkaW5nUXVlc3Rpb24nLCBxdWVzdGlvbilcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUubmV3UXVlc3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24ocXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnZGVsZXRpbmdRdWVzdGlvbicsIHF1ZXN0aW9uKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS5zdG9yZSA9IGZ1bmN0aW9uKHF1ZXN0aW9uLCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBxdWVzdGlvbi5zdGF0dXMgPSBzdGF0dXNcbiAgICAgICAgICAgICAgICBRdWVzdGlvbkZhY3Rvcnkuc3RvcmUocXVlc3Rpb24pLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZGVsZXRlKHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLnVwdm90ZSA9IGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ3Vwdm90aW5nJywgcXVlc3Rpb24pXG4gICAgICAgICAgICAgICAgcXVlc3Rpb24uaGFzVXB2b3RlZCA9ICFxdWVzdGlvbi5oYXNVcHZvdGVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS5kb3dudm90ZSA9IGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2Rvd252b3RpbmcnLCBxdWVzdGlvbilcbiAgICAgICAgICAgICAgICBxdWVzdGlvbi5oYXNVcHZvdGVkID0gIXF1ZXN0aW9uLmhhc1Vwdm90ZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNvY2tldC5vbignYWRkUXVlc3Rpb24nLCBmdW5jdGlvbihxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIHNjb3BlLnF1ZXN0aW9ucy51bnNoaWZ0KHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIHNjb3BlLiRldmFsQXN5bmMoKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdkZWxldGVRdWVzdGlvbicsIGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZmluZEluZGV4KHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIHNjb3BlLnF1ZXN0aW9ucy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICAgICAgc2NvcGUuJGV2YWxBc3luYygpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBzb2NrZXQub24oJ3JlY2VpdmVkVXB2b3RlJywgZnVuY3Rpb24ocXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgocXVlc3Rpb24pXG4gICAgICAgICAgICAgICAgdmFyIHEgPSBzY29wZS5xdWVzdGlvbnNbaW5kZXhdXG4gICAgICAgICAgICAgICAgcS51cHZvdGVzID8gcS51cHZvdGVzKysgOiBxLnVwdm90ZXMgPSAxO1xuICAgICAgICAgICAgICAgIHNjb3BlLiRldmFsQXN5bmMoKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdyZWNlaXZlZERvd252b3RlJywgZnVuY3Rpb24ocXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgocXVlc3Rpb24pXG4gICAgICAgICAgICAgICAgdmFyIHEgPSBzY29wZS5xdWVzdGlvbnNbaW5kZXhdXG4gICAgICAgICAgICAgICAgcS51cHZvdGVzLS07XG4gICAgICAgICAgICAgICAgc2NvcGUuJGV2YWxBc3luYygpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufSk7XG4iLCJhcHAuZmFjdG9yeSgnUXVlc3Rpb25GYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG5cblx0dmFyIG9iaiA9IHt9O1xuXG5cdG9iai5nZXRBbGxCeUxlY3R1cmVJZCA9IGZ1bmN0aW9uKGxlY3R1cmVJZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvcXVlc3Rpb24vbGVjdHVyZS8nICsgbGVjdHVyZUlkKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pXG5cdH1cblxuXHRvYmouc3RvcmUgPSBmdW5jdGlvbihxdWVzdGlvbikge1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3F1ZXN0aW9uJywgcXVlc3Rpb24pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSlcblx0fVxuXG5cdHJldHVybiBvYmo7XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
