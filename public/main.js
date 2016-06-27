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
            scope.questions = [{ text: "What is life?" }, { text: "What is death?" }, { text: "What is code?" }];

            scope.submitQuestion = function () {
                if (scope.newQuestion) scope.questions.unshift({ text: scope.newQuestion });
                scope.newQuestion = null;
            };

            scope.deleteQuestion = function (question) {
                var index = scope.questions.indexOf(question);
                scope.questions.splice(index, 1);
            };
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

    return obj;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9wb2xsL3BvbGwuZGlyZWN0aXZlLmpzIiwiY29tbW9uL3BvbGwvcG9sbC5mYWN0b3J5LmpzIiwiY29tbW9uL3F1ZXN0aW9uL3F1ZXN0aW9uLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9xdWVzdGlvbi9xdWVzdGlvbi5mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE9BQUEsR0FBQSxHQUFBLFFBQUEsTUFBQSxDQUFBLE9BQUEsRUFBQSxDQUFBLFdBQUEsRUFBQSxjQUFBLEVBQUEsV0FBQSxFQUFBLFdBQUEsQ0FBQSxDQUFBOztBQUVBLElBQUEsTUFBQSxDQUFBLFVBQUEsa0JBQUEsRUFBQSxpQkFBQSxFQUFBLGdCQUFBLEVBQUE7O0FBRUEsc0JBQUEsU0FBQSxDQUFBLElBQUE7O0FBRUEsdUJBQUEsU0FBQSxDQUFBLEdBQUE7O0FBRUEsdUJBQUEsSUFBQSxDQUFBLGlCQUFBLEVBQUEsWUFBQTtBQUNBLGVBQUEsUUFBQSxDQUFBLE1BQUE7QUFDQSxLQUZBOztBQUlBLHFCQUFBLE1BQUEsQ0FBQSxJQUFBLEdBQUEsSUFBQTtBQUVBLENBWkE7O0FBY0EsSUFBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxtQkFBQSxLQUFBLENBQUEsU0FBQSxFQUFBO0FBQ0EsYUFBQSxVQURBO0FBRUEscUJBQUE7QUFGQSxLQUFBO0FBSUEsQ0FMQTs7QUFPQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLG1CQUFBLEtBQUEsQ0FBQSxPQUFBLEVBQUE7QUFDQSxhQUFBLFFBREE7QUFFQSxxQkFBQTtBQUZBLEtBQUE7QUFJQSxDQUxBOztBQU9BLElBQUEsVUFBQSxDQUFBLFdBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUE7O0FBRUEsWUFBQSxHQUFBLENBQUEsb0JBQUE7QUFDQSxXQUFBLFdBQUEsR0FBQSxZQUFBO0FBQ0EsZ0JBQUEsR0FBQSxDQUFBLHNCQUFBO0FBQ0EsWUFB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QUFBLFNBQUEsRUFBQTtBQUNBLGVBQUEsTUFBQSxHQUFBLENBQUEsMkJBQUEsU0FBQSxFQUFBLElBQUEsQ0FBQSxVQUFBLEdBQUEsRUFBQTtBQUNBLG1CQUFBLElBQUEsSUFBQTtBQUNBLFNBRkEsQ0FBQTtBQUdBLEtBSkE7O0FBTUEsV0FBQSxHQUFBO0FBRUEsQ0FaQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG53aW5kb3cuYXBwID0gYW5ndWxhci5tb2R1bGUoJ015QXBwJywgWyd1aS5yb3V0ZXInLCAndWkuYm9vdHN0cmFwJywgJ25nQW5pbWF0ZScsICduZ0tvb2tpZXMnXSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRrb29raWVzUHJvdmlkZXIpIHtcbiAgICAvLyBUaGlzIHR1cm5zIG9mZiBoYXNoYmFuZyB1cmxzICgvI2Fib3V0KSBhbmQgY2hhbmdlcyBpdCB0byBzb21ldGhpbmcgbm9ybWFsICgvYWJvdXQpXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgIC8vIElmIHdlIGdvIHRvIGEgVVJMIHRoYXQgdWktcm91dGVyIGRvZXNuJ3QgaGF2ZSByZWdpc3RlcmVkLCBnbyB0byB0aGUgXCIvXCIgdXJsLlxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbiAgICAvLyBUcmlnZ2VyIHBhZ2UgcmVmcmVzaCB3aGVuIGFjY2Vzc2luZyBhbiBPQXV0aCByb3V0ZVxuICAgICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcvYXV0aC86cHJvdmlkZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KTtcblxuICAgICRrb29raWVzUHJvdmlkZXIuY29uZmlnLmpzb24gPSB0cnVlO1xuXG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc3R1ZGVudCcsIHtcbiAgICAgICAgdXJsOiAnL3N0dWRlbnQnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3ZpZXdzL3N0dWRlbnQvc3R1ZGVudC5odG1sJyxcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbicsIHtcbiAgICAgICAgdXJsOiAnL2FkbWluJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy92aWV3cy9pbnN0cnVjdG9yL2luc3RydWN0b3IuaHRtbCcsXG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSkge1xuXG5cdGNvbnNvbGUubG9nKFwicmVhY2hlZCBsb2dpbiBjdHJsXCIpO1xuXHQkc2NvcGUubG9naW5TdGF0dXMgPSBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKFwicmVhY2hlZCBsb2dpbiBzdGF0dXNcIik7XG5cdFx0dmFyIHRlbXAgPSAkc2NvcGUubG9naW47XG5cdFx0Y29uc29sZS5sb2coXCJ0ZW1wOiBcIix0ZW1wKTtcblxuXHRcdGlmICh0ZW1wPT09J2FkbWluJyl7XG5cdFx0XHQkc3RhdGUuZ28oJ2FkbWluJyk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHRlbXA9PT0nc3R1ZGVudCcpe1xuXHRcdFx0JHN0YXRlLmdvKCdzdHVkZW50Jyk7XG5cdFx0fVxuXHR9XG5cbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgncG9sbCcsICgkc3RhdGUsIFBvbGxGYWN0b3J5KSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZToge1xuXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9wb2xsL3BvbGwuaHRtbCcsXG4gICAgbGluazogKHNjb3BlKSA9PiB7XG4gICAgICBQb2xsRmFjdG9yeS5nZXRBbGxCeUxlY3R1cmVJZCgxKVxuICAgICAgLnRoZW4oKHBvbGxzKSA9PiB7XG4gICAgICAgIHNjb3BlLnBvbGxzID0gcG9sbHNcbiAgICAgIH0pXG4gICAgfVxuICB9XG59KVxuIiwiYXBwLmZhY3RvcnkoJ1BvbGxGYWN0b3J5JywgKCRodHRwKSA9PiB7XG4gIGZ1bmN0aW9uIGRvdERhdGEoZG90KSB7XG4gICAgcmV0dXJuIGRvdC5kYXRhXG4gIH1cbiAgcmV0dXJuIHtcbiAgICBkb3REYXRhOiAoZG90KSA9PiB7XG4gICAgICByZXR1cm4gZG90LmRhdGFcbiAgICB9LFxuICAgIGdldEFsbEJ5TGVjdHVyZUlkOiAoaWQpID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvcG9sbC9sZWN0dXJlLycraWQpXG4gICAgICAudGhlbihkb3REYXRhKVxuICAgIH0sXG4gICAgZ2V0T25lQnlQb2xsSWQ6IChpZCkgPT4ge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9wb2xsLycraWQpXG4gICAgICAudGhlbihkb3REYXRhKVxuICAgIH0sXG4gICAgY3JlYXRlUG9sbDogKHBvbGxPYmopID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3BvbGwvJywgcG9sbE9iailcbiAgICAgIC50aGVuKGRvdERhdGEpXG4gICAgfSxcbiAgICB1cGRhdGVQb2xsOiAocG9sbE9iaiwgaWQpID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvcG9sbC8nK2lkLCBwb2xsT2JqKVxuICAgICAgLnRoZW4oZG90RGF0YSlcbiAgICB9LFxuICAgIGRlbGV0ZVBvbGw6IChpZCkgPT4ge1xuICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS9wb2xsLycraWQpXG4gICAgICAudGhlbihkb3REYXRhKVxuICAgIH1cbiAgfVxufSlcbiIsImFwcC5kaXJlY3RpdmUoJ3F1ZXN0aW9uJywgZnVuY3Rpb24oJHN0YXRlLCBRdWVzdGlvbkZhY3RvcnkpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vcXVlc3Rpb24vcXVlc3Rpb24uaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS5xdWVzdGlvbnMgPSBbXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBcIldoYXQgaXMgbGlmZT9cIn0sXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBcIldoYXQgaXMgZGVhdGg/XCJ9LFxuICAgICAgICAgICAgICAgIHsgdGV4dDogXCJXaGF0IGlzIGNvZGU/XCJ9LFxuICAgICAgICAgICAgXVxuXG4gICAgICAgICAgICBzY29wZS5zdWJtaXRRdWVzdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChzY29wZS5uZXdRdWVzdGlvbikgc2NvcGUucXVlc3Rpb25zLnVuc2hpZnQoe3RleHQ6IHNjb3BlLm5ld1F1ZXN0aW9ufSlcbiAgICAgICAgICAgICAgICBzY29wZS5uZXdRdWVzdGlvbiA9IG51bGxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2NvcGUuZGVsZXRlUXVlc3Rpb24gPSBmdW5jdGlvbihxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHNjb3BlLnF1ZXN0aW9ucy5pbmRleE9mKHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIHNjb3BlLnF1ZXN0aW9ucy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiIsImFwcC5mYWN0b3J5KCdRdWVzdGlvbkZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuXHR2YXIgb2JqID0ge307XG5cblx0b2JqLmdldEFsbEJ5TGVjdHVyZUlkID0gZnVuY3Rpb24obGVjdHVyZUlkKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9xdWVzdGlvbi9sZWN0dXJlLycgKyBsZWN0dXJlSWQpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSlcblx0fVxuXG5cdHJldHVybiBvYmo7XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
