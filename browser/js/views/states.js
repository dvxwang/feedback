app.config(function ($stateProvider) {
    $stateProvider.state('student', {
        url: '/student',
        templateUrl: 'js/views/student/student.html',
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: 'js/views/instructor/instructor.html',
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('summary', {
        url: '/summary',
        templateUrl: 'js/views/summary/summary.html',
    });
});