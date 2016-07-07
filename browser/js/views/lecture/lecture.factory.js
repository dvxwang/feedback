app.factory('LectureFactory', function ($http) {
	var obj = {};
	var cachedList = { active: [], past: [] };

	obj.create = create;
	obj.getInstructorLectures = getInstructorLectures;
	obj.setStart = setStart;
	obj.setEnd = setEnd;
	obj.getById = getById;

	// function declarations
	function create(lectureName) {
		return $http.post('api/lecture', { name: lectureName })
		.then(function(lecture) {
			cachedList.active.push(lecture.data);
			return lecture.data;
		})
	}

	function update(lecture, data) {
		return $http.put('api/lecture/' + lecture.id, data)
		.then(function(res) {
			return res.data
		})
	}

	function getCurrentTime() { return Math.floor(Date.now()/1000) };

	function setStart(lecture) {
		return update(lecture, { startTime: getCurrentTime() })
	}

	function setEnd(lecture) {
		return update(lecture, { endTime: getCurrentTime() })
	}

	function getInstructorLectures() {
		return $http.get('api/lecture/instructor')
		.then(function(lectures) {
			cachedList.active = lectures.data.filter((lecture) => lecture.endTime === null);
			cachedList.past = lectures.data.filter((lecture) => lecture.endTime !== null);
			return cachedList;
		})
	}

	function getById(lectureId) {
		return $http.get('api/lecture/'+lectureId)
		.then(function(lecture) {
			return lecture.data
		})
	}

	return obj;
})