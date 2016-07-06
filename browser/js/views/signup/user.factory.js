app.factory('UserFactory', function ($http) {
	var obj = {};

	obj.createUser = function (data) {
		return $http.post('/api/user', data)
	}

	obj.updateUser = function (userId, data) {
		return $http.put('/api/user/' + userId, data)
	}

	obj.deleteUser = function (userId, data) {
		return $http.delete('/api/user/' + userId)
	}

	return obj
})