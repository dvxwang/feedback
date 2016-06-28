app.factory('LectureFactory', function ($http) {
	var LectureFactory = {};
	
	var curLecture;

	LectureFactory.setStart = function () {
		return $.post('api/lecture/start',{name: "Demo Lecture", lecturer: "Omri", startTime: Math.floor(Date.now()/1000)},function(result){
            console.log("Result: ",result);
            curLecture = result.id;
        });
	}

	LectureFactory.setEnd = function () {
		return $.post('api/lecture/end',{id: curLecture, endTime: Math.floor(Date.now()/1000)});
	}

	return LectureFactory
})