app.config(function ($stateProvider) {
    $stateProvider.state('student', {
        url: '/student/:lectureId',
        templateUrl: 'js/views/student/student.html',
        controller: 'StudentCtrl',
        resolve: {
          curLecture: function(LectureFactory, $stateParams) {
            return LectureFactory.getById($stateParams.lectureId)
            .then(function(lecture) {
              return lecture
            })
          }
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('instructor', {
        url: '/instructor/:lectureId',
        templateUrl: 'js/views/instructor/instructor.html',
        controller: 'InstructorCtrl',
        resolve: {
          curLecture: function(LectureFactory, $stateParams) {
            return LectureFactory.getById($stateParams.lectureId)
          }
        }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('summary', {
        url: '/summary/:lectureId',
        templateUrl: 'js/views/summary/summary.html',
        controller: 'SummaryCtrl',
        resolve: {
          lecture: function(LectureFactory, $stateParams) {
            return LectureFactory.getById($stateParams.lectureId)
        }
      }
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('lecture', {
        url: '/lecture',
        templateUrl: 'js/views/lecture/lecture.html',
        controller: 'LectureController',
        resolve: {
            user: function(AuthService) {
                return AuthService.getLoggedInUser()
            }
        }
    });
});

//Uncomment to enable user signup
// app.config(function ($stateProvider) {
//     $stateProvider.state('signup', {
//         url: '/signup',
//         templateUrl: 'js/views/signup/signup.html',
//         controller: 'SignupCtrl'
//     });
// });

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/', '/login');

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/views/signup/login.html',
        controller: 'LoginCtrl'
    });
});
