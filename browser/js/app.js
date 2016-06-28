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
        templateUrl: 'js/views/student/student.html',
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: 'js/views/instructor/instructor.html',
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('summary', {
        url: '/summary',
        templateUrl: 'js/views/summary/summary.html',
    });
});

app.controller('LoginCtrl', function ($scope, $state) {

	$scope.loginStatus = function(){
		var temp = $scope.login;

		if (temp==='admin'){
			$state.go('admin');
		}
		else if (temp==='student'){
			$state.go('student');
		}
        else if (temp==='summary'){
            $state.go('summary');
        }
	}

});
