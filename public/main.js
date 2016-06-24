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
            QuestionFactory.getAllByLectureId(1).then(function (questions) {
                scope.questions = questions;
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

    return obj;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbW1vbi9xdWVzdGlvbi9xdWVzdGlvbi5kaXJlY3RpdmUuanMiLCJjb21tb24vcXVlc3Rpb24vcXVlc3Rpb24uZmFjdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxPQUFBLEdBQUEsR0FBQSxRQUFBLE1BQUEsQ0FBQSxPQUFBLEVBQUEsQ0FBQSxXQUFBLEVBQUEsY0FBQSxFQUFBLFdBQUEsRUFBQSxXQUFBLENBQUEsQ0FBQTs7QUFFQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGtCQUFBLEVBQUEsaUJBQUEsRUFBQSxnQkFBQSxFQUFBOztBQUVBLHNCQUFBLFNBQUEsQ0FBQSxJQUFBOztBQUVBLHVCQUFBLFNBQUEsQ0FBQSxHQUFBOztBQUVBLHVCQUFBLElBQUEsQ0FBQSxpQkFBQSxFQUFBLFlBQUE7QUFDQSxlQUFBLFFBQUEsQ0FBQSxNQUFBO0FBQ0EsS0FGQTs7QUFJQSxxQkFBQSxNQUFBLENBQUEsSUFBQSxHQUFBLElBQUE7QUFFQSxDQVpBO0FDSkEsSUFBQSxTQUFBLENBQUEsVUFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLGVBQUEsRUFBQTs7QUFFQSxXQUFBO0FBQ0Esa0JBQUEsR0FEQTtBQUVBLGVBQUEsRUFGQTtBQUtBLHFCQUFBLGtDQUxBO0FBTUEsY0FBQSxjQUFBLEtBQUEsRUFBQTtBQUNBLDRCQUFBLGlCQUFBLENBQUEsQ0FBQSxFQUFBLElBQUEsQ0FBQSxVQUFBLFNBQUEsRUFBQTtBQUNBLHNCQUFBLFNBQUEsR0FBQSxTQUFBO0FBQ0EsYUFGQTtBQUdBO0FBVkEsS0FBQTtBQVlBLENBZEE7O0FDQUEsSUFBQSxPQUFBLENBQUEsaUJBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQTs7QUFFQSxRQUFBLE1BQUEsRUFBQTs7QUFFQSxRQUFBLGlCQUFBLEdBQUEsVUFBQSxTQUFBLEVBQUE7QUFDQSxlQUFBLE1BQUEsR0FBQSxDQUFBLDJCQUFBLFNBQUEsRUFBQSxJQUFBLENBQUEsVUFBQSxHQUFBLEVBQUE7QUFDQSxtQkFBQSxJQUFBLElBQUE7QUFDQSxTQUZBLENBQUE7QUFHQSxLQUpBOztBQU1BLFdBQUEsR0FBQTtBQUVBLENBWkEiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0Jztcblxud2luZG93LmFwcCA9IGFuZ3VsYXIubW9kdWxlKCdNeUFwcCcsIFsndWkucm91dGVyJywgJ3VpLmJvb3RzdHJhcCcsICduZ0FuaW1hdGUnLCAnbmdLb29raWVzJ10pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAka29va2llc1Byb3ZpZGVyKSB7XG4gICAgLy8gVGhpcyB0dXJucyBvZmYgaGFzaGJhbmcgdXJscyAoLyNhYm91dCkgYW5kIGNoYW5nZXMgaXQgdG8gc29tZXRoaW5nIG5vcm1hbCAoL2Fib3V0KVxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAvLyBJZiB3ZSBnbyB0byBhIFVSTCB0aGF0IHVpLXJvdXRlciBkb2Vzbid0IGhhdmUgcmVnaXN0ZXJlZCwgZ28gdG8gdGhlIFwiL1wiIHVybC5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG4gICAgLy8gVHJpZ2dlciBwYWdlIHJlZnJlc2ggd2hlbiBhY2Nlc3NpbmcgYW4gT0F1dGggcm91dGVcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignL2F1dGgvOnByb3ZpZGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG5cbiAgICAka29va2llc1Byb3ZpZGVyLmNvbmZpZy5qc29uID0gdHJ1ZTtcblxufSk7IiwiYXBwLmRpcmVjdGl2ZSgncXVlc3Rpb24nLCBmdW5jdGlvbiAoJHN0YXRlLCBRdWVzdGlvbkZhY3RvcnkpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vcXVlc3Rpb24vcXVlc3Rpb24uaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICAgIFx0UXVlc3Rpb25GYWN0b3J5LmdldEFsbEJ5TGVjdHVyZUlkKDEpLnRoZW4oZnVuY3Rpb24ocXVlc3Rpb25zKSB7XG4gICAgICAgIFx0XHRzY29wZS5xdWVzdGlvbnMgPSBxdWVzdGlvbnNcbiAgICAgICAgXHR9KVxuICAgICAgICB9XG4gICAgfVxufSk7XG4iLCJhcHAuZmFjdG9yeSgnUXVlc3Rpb25GYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG5cblx0dmFyIG9iaiA9IHt9O1xuXG5cdG9iai5nZXRBbGxCeUxlY3R1cmVJZCA9IGZ1bmN0aW9uKGxlY3R1cmVJZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvcXVlc3Rpb24vbGVjdHVyZS8nICsgbGVjdHVyZUlkKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhXG5cdFx0fSlcblx0fVxuXG5cdHJldHVybiBvYmo7XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
