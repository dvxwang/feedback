app.controller('SignupCtrl', function($scope, UserFactory, $state) {
	$scope.createUser = (data) => {
		UserFactory.createUser(data)
		.then(() => $state.go('lecture'))
	}
})