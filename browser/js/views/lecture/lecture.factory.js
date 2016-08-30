app.factory('LectureFactory', function ($http) {
	var obj = {};
	var cachedList = { active: [], past: [] };

	obj.create = create;
	obj.getInstructorLectures = getInstructorLectures;
	obj.setStart = setStart;
	obj.setEnd = setEnd;
	obj.getById = getById;
	obj.deleteLecture = deleteLecture;
	obj.instructorEmails = {
		'Gabe Lebec': "gabriel@fullstackacademy.com",
		'Omri Bernstein': "omri@fullstackacademy.com",
		'Joe Alves': "joe@fullstackacademy.com",
		'Kate Humphrey': "kate@fullstackacademy.com",
		'Ben Cohen': "ben.cohen@fullstackacademy.com",
		'Emily Intersimone': "emily@gracehopper.com",
		'David Wang': "dvxwang@gmail.com"
	};

	// function declarations
	function create(lecture) {
		return $http.post('api/lecture', lecture)
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
		return $http.get('api/lecture')
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

	function deleteLecture(lectureId) {
		return $http.delete('api/lecture/'+lectureId)
	}

	return obj;
})
