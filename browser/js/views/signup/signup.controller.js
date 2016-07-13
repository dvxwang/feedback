app.controller('SignupCtrl', function($scope, UserFactory, $state, AuthService) {
	$scope.createUser = (data) => {
		data.email = data.email.toLowerCase();
		return UserFactory.createUser(data)
		.then(() => AuthService.login({email: data.email, password: data.password}))
		.then(() => $state.go('lecture'))
	}
})