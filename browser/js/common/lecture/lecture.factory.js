app.factory('LectureFactory', function ($http) {
	var LectureFactory = {};

	LectureFactory.setStart = function () {
		return $http.post('api/lecture/start',{name: "Demo Lecture", lecturer: "Omri", startTime: Math.floor(Date.now()/1000)})
	}

	LectureFactory.setEnd = function () {
		return $http.post('api/lecture/end',{id: curLecture.id, endTime: Math.floor(Date.now()/1000)})
	}

	LectureFactory.getCurLecture = function () {
		return $http.get('api/lecture/current').then(function(res) {
			return res.data;
		})
	}

	return LectureFactory
})
