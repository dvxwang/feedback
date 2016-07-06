app.factory('LectureFactory', function ($http) {
	var LectureFactory = {};
	var cachedActiveList = [];

	LectureFactory.create = function(lectureName) {
		return $http.post('api/lecture/create', {name:lectureName})
		.then(function(lecture) {
			cachedActiveList.push(lecture.data)
			return lecture.data
		})
	}

	LectureFactory.setStart = function (lecture) {
		lecture.startTime = Math.floor(Date.now()/1000)
		return $http.put('api/lecture/start', lecture)
		.then(function(res) {
			return res.data
		})
	}

	LectureFactory.setEnd = function (lecture) {
		return $http.put('api/lecture/end', lecture)
		.then(function(lecture) {
			return lecture.data
		})
	}

	LectureFactory.activeList = function() {
		return $http.get('api/lecture/instructor/active')
		.then(function(lectures) {
			cachedActiveList = lectures.data
			return cachedActiveList
		})
	}

	LectureFactory.pastList = function() {
		return $http.get('api/lecture/instructor/past')
		.then(function(lectures) {
			return lectures.data
		})
	}

	LectureFactory.getById = function(lectureId) {
		return $http.get('api/lecture/'+lectureId)
		.then(function(lecture) {
			return lecture.data
		})
	}

	return LectureFactory
})
