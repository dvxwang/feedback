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
app.directive('question', function ($state) {

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9xdWVzdGlvbi9xdWVzdGlvbi5kaXJlY3RpdmUuanMiLCJjb21tb24vcXVlc3Rpb24vcXVlc3Rpb24uZmFjdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxPQUFBLEdBQUEsR0FBQSxRQUFBLE1BQUEsQ0FBQSxPQUFBLEVBQUEsQ0FBQSxXQUFBLEVBQUEsY0FBQSxFQUFBLFdBQUEsRUFBQSxXQUFBLENBQUEsQ0FBQTs7QUFFQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGtCQUFBLEVBQUEsaUJBQUEsRUFBQSxnQkFBQSxFQUFBOztBQUVBLHNCQUFBLFNBQUEsQ0FBQSxJQUFBOztBQUVBLHVCQUFBLFNBQUEsQ0FBQSxHQUFBOztBQUVBLHVCQUFBLElBQUEsQ0FBQSxpQkFBQSxFQUFBLFlBQUE7QUFDQSxlQUFBLFFBQUEsQ0FBQSxNQUFBO0FBQ0EsS0FGQTs7QUFJQSxxQkFBQSxNQUFBLENBQUEsSUFBQSxHQUFBLElBQUE7QUFFQSxDQVpBO0FDSkEsSUFBQSxTQUFBLENBQUEsVUFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBOztBQUVBLFdBQUE7QUFDQSxrQkFBQSxHQURBO0FBRUEsZUFBQSxFQUZBO0FBS0EscUJBQUEsa0NBTEE7QUFNQSxjQUFBLGNBQUEsS0FBQSxFQUFBO0FBQ0Esa0JBQUEsU0FBQSxHQUFBLENBQ0EsRUFBQSxNQUFBLGVBQUEsRUFEQSxFQUVBLEVBQUEsTUFBQSxnQkFBQSxFQUZBLEVBR0EsRUFBQSxNQUFBLGVBQUEsRUFIQSxDQUFBOztBQU1BLGtCQUFBLGNBQUEsR0FBQSxZQUFBO0FBQ0Esb0JBQUEsTUFBQSxXQUFBLEVBQUEsTUFBQSxTQUFBLENBQUEsT0FBQSxDQUFBLEVBQUEsTUFBQSxNQUFBLFdBQUEsRUFBQTtBQUNBLHNCQUFBLFdBQUEsR0FBQSxJQUFBO0FBQ0EsYUFIQTs7QUFLQSxrQkFBQSxjQUFBLEdBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxvQkFBQSxRQUFBLE1BQUEsU0FBQSxDQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUE7QUFDQSxzQkFBQSxTQUFBLENBQUEsTUFBQSxDQUFBLEtBQUEsRUFBQSxDQUFBO0FBQ0EsYUFIQTtBQUlBO0FBdEJBLEtBQUE7QUF3QkEsQ0ExQkE7O0FDQUEsSUFBQSxPQUFBLENBQUEsaUJBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQTs7QUFFQSxRQUFBLE1BQUEsRUFBQTs7QUFFQSxRQUFBLGlCQUFBLEdBQUEsVUFBQSxTQUFBLEVBQUE7QUFDQSxlQUFBLE1BQUEsR0FBQSxDQUFBLDJCQUFBLFNBQUEsRUFBQSxJQUFBLENBQUEsVUFBQSxHQUFBLEVBQUE7QUFDQSxtQkFBQSxJQUFBLElBQUE7QUFDQSxTQUZBLENBQUE7QUFHQSxLQUpBOztBQU1BLFdBQUEsR0FBQTtBQUVBLENBWkEiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0Jztcblxud2luZG93LmFwcCA9IGFuZ3VsYXIubW9kdWxlKCdNeUFwcCcsIFsndWkucm91dGVyJywgJ3VpLmJvb3RzdHJhcCcsICduZ0FuaW1hdGUnLCAnbmdLb29raWVzJ10pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAka29va2llc1Byb3ZpZGVyKSB7XG4gICAgLy8gVGhpcyB0dXJucyBvZmYgaGFzaGJhbmcgdXJscyAoLyNhYm91dCkgYW5kIGNoYW5nZXMgaXQgdG8gc29tZXRoaW5nIG5vcm1hbCAoL2Fib3V0KVxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAvLyBJZiB3ZSBnbyB0byBhIFVSTCB0aGF0IHVpLXJvdXRlciBkb2Vzbid0IGhhdmUgcmVnaXN0ZXJlZCwgZ28gdG8gdGhlIFwiL1wiIHVybC5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG4gICAgLy8gVHJpZ2dlciBwYWdlIHJlZnJlc2ggd2hlbiBhY2Nlc3NpbmcgYW4gT0F1dGggcm91dGVcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignL2F1dGgvOnByb3ZpZGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG5cbiAgICAka29va2llc1Byb3ZpZGVyLmNvbmZpZy5qc29uID0gdHJ1ZTtcblxufSk7IiwiYXBwLmRpcmVjdGl2ZSgncXVlc3Rpb24nLCBmdW5jdGlvbigkc3RhdGUpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vcXVlc3Rpb24vcXVlc3Rpb24uaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS5xdWVzdGlvbnMgPSBbXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBcIldoYXQgaXMgbGlmZT9cIn0sXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBcIldoYXQgaXMgZGVhdGg/XCJ9LFxuICAgICAgICAgICAgICAgIHsgdGV4dDogXCJXaGF0IGlzIGNvZGU/XCJ9LFxuICAgICAgICAgICAgXVxuXG4gICAgICAgICAgICBzY29wZS5zdWJtaXRRdWVzdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChzY29wZS5uZXdRdWVzdGlvbikgc2NvcGUucXVlc3Rpb25zLnVuc2hpZnQoe3RleHQ6IHNjb3BlLm5ld1F1ZXN0aW9ufSlcbiAgICAgICAgICAgICAgICBzY29wZS5uZXdRdWVzdGlvbiA9IG51bGxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2NvcGUuZGVsZXRlUXVlc3Rpb24gPSBmdW5jdGlvbihxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHNjb3BlLnF1ZXN0aW9ucy5pbmRleE9mKHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIHNjb3BlLnF1ZXN0aW9ucy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiIsImFwcC5mYWN0b3J5KCdRdWVzdGlvbkZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuXHR2YXIgb2JqID0ge307XG5cblx0b2JqLmdldEFsbEJ5TGVjdHVyZUlkID0gZnVuY3Rpb24obGVjdHVyZUlkKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9xdWVzdGlvbi9sZWN0dXJlLycgKyBsZWN0dXJlSWQpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGFcblx0XHR9KVxuXHR9XG5cblx0cmV0dXJuIG9iajtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
