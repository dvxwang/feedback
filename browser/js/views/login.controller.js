app.controller('LoginCtrl', function ($scope, $state) {

	$scope.loginStatus = function(){
		var temp = $scope.login.toLowerCase();

		if (temp==='admin'){
			console.log('Check1');
			$state.go('admin');
		}
		else if (temp==='student'){
			$state.go('student');
		}
        else if (temp==='summary'){
            $state.go('summary');
        }
        else {
            $scope.login = "";
            $("input").attr("placeholder", "Please input valid credential");            
        }
	}

});