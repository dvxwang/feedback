app.factory('LectureFactory', function ($http) {
	var LectureFactory = {};
	var curLecture = null;

	LectureFactory.setStart = function () {
		return $http.post('api/lecture/start',{name: "Demo Lecture", lecturer: "Omri", startTime: Math.floor(Date.now()/1000)})
		.then(function(res){
			curLecture = res.data;
			return curLecture
        });
	}

	LectureFactory.setEnd = function () {
		return $http.post('api/lecture/end',{id: curLecture.id, endTime: Math.floor(Date.now()/1000)})
		.then(function(res) {
			curLecture = null;
			return curLecture
		})
	}

	LectureFactory.getCurLecture = function () {
		return $http.get('api/lecture/current').then(function(res) {
			curLecture = res.data;
			return curLecture
		})
	}

	return LectureFactory
})
