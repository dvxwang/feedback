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
    var cache = [];

    obj.getAllByLectureId = function (lectureId) {
        return $http.get('/api/question/lecture/' + lectureId).then(function (res) {
            angular.copy(res.data, cache);
            return cache;
        });
    };

    return obj;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9xdWVzdGlvbi9xdWVzdGlvbi5kaXJlY3RpdmUuanMiLCJjb21tb24vcXVlc3Rpb24vcXVlc3Rpb24uZmFjdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxPQUFBLEdBQUEsR0FBQSxRQUFBLE1BQUEsQ0FBQSxPQUFBLEVBQUEsQ0FBQSxXQUFBLEVBQUEsY0FBQSxFQUFBLFdBQUEsRUFBQSxXQUFBLENBQUEsQ0FBQTs7QUFFQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGtCQUFBLEVBQUEsaUJBQUEsRUFBQSxnQkFBQSxFQUFBOztBQUVBLHNCQUFBLFNBQUEsQ0FBQSxJQUFBOztBQUVBLHVCQUFBLFNBQUEsQ0FBQSxHQUFBOztBQUVBLHVCQUFBLElBQUEsQ0FBQSxpQkFBQSxFQUFBLFlBQUE7QUFDQSxlQUFBLFFBQUEsQ0FBQSxNQUFBO0FBQ0EsS0FGQTs7QUFJQSxxQkFBQSxNQUFBLENBQUEsSUFBQSxHQUFBLElBQUE7QUFFQSxDQVpBO0FDSkEsSUFBQSxTQUFBLENBQUEsVUFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLGVBQUEsRUFBQTs7QUFFQSxXQUFBO0FBQ0Esa0JBQUEsR0FEQTtBQUVBLGVBQUEsRUFGQTtBQUtBLHFCQUFBLGtDQUxBO0FBTUEsY0FBQSxjQUFBLEtBQUEsRUFBQTtBQUNBLGtCQUFBLFNBQUEsR0FBQSxDQUNBLEVBQUEsTUFBQSxlQUFBLEVBREEsRUFFQSxFQUFBLE1BQUEsZ0JBQUEsRUFGQSxFQUdBLEVBQUEsTUFBQSxlQUFBLEVBSEEsQ0FBQTs7QUFNQSxrQkFBQSxjQUFBLEdBQUEsWUFBQTtBQUNBLG9CQUFBLE1BQUEsV0FBQSxFQUFBLE1BQUEsU0FBQSxDQUFBLE9BQUEsQ0FBQSxFQUFBLE1BQUEsTUFBQSxXQUFBLEVBQUE7QUFDQSxzQkFBQSxXQUFBLEdBQUEsSUFBQTtBQUNBLGFBSEE7O0FBS0Esa0JBQUEsY0FBQSxHQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0Esb0JBQUEsUUFBQSxNQUFBLFNBQUEsQ0FBQSxPQUFBLENBQUEsUUFBQSxDQUFBO0FBQ0Esc0JBQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxLQUFBLEVBQUEsQ0FBQTtBQUNBLGFBSEE7QUFJQTtBQXRCQSxLQUFBO0FBd0JBLENBMUJBOztBQ0FBLElBQUEsT0FBQSxDQUFBLGlCQUFBLEVBQUEsVUFBQSxLQUFBLEVBQUE7O0FBRUEsUUFBQSxNQUFBLEVBQUE7QUFDQSxRQUFBLFFBQUEsRUFBQTs7QUFFQSxRQUFBLGlCQUFBLEdBQUEsVUFBQSxTQUFBLEVBQUE7QUFDQSxlQUFBLE1BQUEsR0FBQSxDQUFBLDJCQUFBLFNBQUEsRUFBQSxJQUFBLENBQUEsVUFBQSxHQUFBLEVBQUE7QUFDQSxvQkFBQSxJQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQTtBQUNBLG1CQUFBLEtBQUE7QUFDQSxTQUhBLENBQUE7QUFJQSxLQUxBOztBQU9BLFdBQUEsR0FBQTtBQUVBLENBZEEiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0Jztcblxud2luZG93LmFwcCA9IGFuZ3VsYXIubW9kdWxlKCdNeUFwcCcsIFsndWkucm91dGVyJywgJ3VpLmJvb3RzdHJhcCcsICduZ0FuaW1hdGUnLCAnbmdLb29raWVzJ10pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAka29va2llc1Byb3ZpZGVyKSB7XG4gICAgLy8gVGhpcyB0dXJucyBvZmYgaGFzaGJhbmcgdXJscyAoLyNhYm91dCkgYW5kIGNoYW5nZXMgaXQgdG8gc29tZXRoaW5nIG5vcm1hbCAoL2Fib3V0KVxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAvLyBJZiB3ZSBnbyB0byBhIFVSTCB0aGF0IHVpLXJvdXRlciBkb2Vzbid0IGhhdmUgcmVnaXN0ZXJlZCwgZ28gdG8gdGhlIFwiL1wiIHVybC5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG4gICAgLy8gVHJpZ2dlciBwYWdlIHJlZnJlc2ggd2hlbiBhY2Nlc3NpbmcgYW4gT0F1dGggcm91dGVcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignL2F1dGgvOnByb3ZpZGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG5cbiAgICAka29va2llc1Byb3ZpZGVyLmNvbmZpZy5qc29uID0gdHJ1ZTtcblxufSk7IiwiYXBwLmRpcmVjdGl2ZSgncXVlc3Rpb24nLCBmdW5jdGlvbigkc3RhdGUsIFF1ZXN0aW9uRmFjdG9yeSkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIFxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9xdWVzdGlvbi9xdWVzdGlvbi5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUpIHtcbiAgICAgICAgICAgIHNjb3BlLnF1ZXN0aW9ucyA9IFtcbiAgICAgICAgICAgICAgICB7IHRleHQ6IFwiV2hhdCBpcyBsaWZlP1wifSxcbiAgICAgICAgICAgICAgICB7IHRleHQ6IFwiV2hhdCBpcyBkZWF0aD9cIn0sXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBcIldoYXQgaXMgY29kZT9cIn0sXG4gICAgICAgICAgICBdXG5cbiAgICAgICAgICAgIHNjb3BlLnN1Ym1pdFF1ZXN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm5ld1F1ZXN0aW9uKSBzY29wZS5xdWVzdGlvbnMudW5zaGlmdCh7dGV4dDogc2NvcGUubmV3UXVlc3Rpb259KVxuICAgICAgICAgICAgICAgIHNjb3BlLm5ld1F1ZXN0aW9uID0gbnVsbFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS5kZWxldGVRdWVzdGlvbiA9IGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gc2NvcGUucXVlc3Rpb25zLmluZGV4T2YocXVlc3Rpb24pXG4gICAgICAgICAgICAgICAgc2NvcGUucXVlc3Rpb25zLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiYXBwLmZhY3RvcnkoJ1F1ZXN0aW9uRmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG5cdHZhciBvYmogPSB7fTtcblx0dmFyIGNhY2hlID0gW107XG5cblx0b2JqLmdldEFsbEJ5TGVjdHVyZUlkID0gZnVuY3Rpb24obGVjdHVyZUlkKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9xdWVzdGlvbi9sZWN0dXJlLycgKyBsZWN0dXJlSWQpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRhbmd1bGFyLmNvcHkocmVzLmRhdGEsIGNhY2hlKTtcblx0XHRcdHJldHVybiBjYWNoZTtcblx0XHR9KVxuXHR9XG5cblx0cmV0dXJuIG9iajtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
