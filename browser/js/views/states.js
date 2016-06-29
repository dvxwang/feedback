app.config(function ($stateProvider) {
    $stateProvider.state('student', {
        url: '/student',
        templateUrl: 'js/views/student/student.html',
        controller: 'StudentCtrl',
        resolve: {
            curLecture: function(LectureFactory) {
                return LectureFactory.getCurLecture()
            }
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: 'js/views/instructor/instructor.html',
        controller: 'InstructorCtrl'
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('summary', {
        url: '/summary',
        templateUrl: 'js/views/summary/summary.html',
    });
});