app.config(function ($stateProvider) {
    $stateProvider.state('student', {
        url: '/student',
        templateUrl: 'js/views/student/student.html',
        controller: 'StudentCtrl'
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('instructor', {
        url: '/instructor',
        templateUrl: 'js/views/instructor/instructor.html',
        controller: 'InstructorCtrl',
        params: {
          'lecture': null
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('summary', {
        url: '/summary',
        templateUrl: 'js/views/summary/summary.html',
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('lecture', {
        url: '/lecture',
        templateUrl: 'js/views/lecture/lecture.html',
        controller: 'LectureController'
    });
});
