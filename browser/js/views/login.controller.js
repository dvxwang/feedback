app.controller('LoginCtrl', function ($scope, $state, AuthService) {
    AuthService.getLoggedInUser().then((user) => { if (user) $state.go('lecture') }); 

    $scope.login = {};
    $scope.error = null;

	$scope.lectureView = function(lectureId) {
		$state.go('student', {'lectureId':lectureId});
	}

    $scope.sendLogin = function (loginInfo) {
        AuthService.login(loginInfo).then(function () {
            $state.go('lecture');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });
    };
});
