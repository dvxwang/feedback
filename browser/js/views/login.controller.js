app.controller('LoginCtrl', function ($scope, $state) {

	$scope.loginStatus = function(){
		var temp = $scope.login.toLowerCase();

		switch (temp) {
			case 'admin':
				$state.go('admin');
				break;
			case 'student':
				$state.go('student');
				break;
			case 'summary':
				$state.go('summary');
				break;
			default:
				$scope.login = "";
				$("input").attr("placeholder", "Please input valid credential");
		}

		// if (temp==='admin'){
		// 	$state.go('admin');
		// } else if (temp==='student'){
		// 	$state.go('student');
		// } else if (temp==='summary'){
    //   $state.go('summary');
    // } else {
    //   $scope.login = "";
    //   $("input").attr("placeholder", "Please input valid credential");
    // }

	}

});
