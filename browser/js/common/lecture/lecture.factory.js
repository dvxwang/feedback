app.factory('LectureFactory', function ($http) {
	var LectureFactory = {};

	LectureFactory.create = function(lectureName) {
		return $http.post('api/lecture/create', {name:lectureName})
		.then(function(lecture) {
			return lecture.data
		})
	}

	LectureFactory.setStart = function (lectureName, lectureTeacher) {
		return $http.post('api/lecture/start',{name: lectureName, lecturer: lectureTeacher, startTime: Math.floor(Date.now()/1000)})
		.then(function(res) {
			return res.data
		})
	}

	LectureFactory.setEnd = function () {
		return $http.post('api/lecture/end')
	}

	LectureFactory.list = function() {
		return $http.get('api/lecture/instructor')
		.then(function(lectures) {
			return lectures.data
		})
	}

	return LectureFactory
})
