app.controller('LectureController', function ($scope, $state, LectureFactory, $uibModal, user, AuthService) {
  $scope.user = user;
  $scope.logout = () => {
    return AuthService.logout().then(() => $state.go('login'))
  }

  getLectures();

  socket.on('lectureChange', getLectures);

  function getLectures() {
    LectureFactory.getInstructorLectures()
    .then((lectures) => {
      $scope.activelecturelist = lectures.active;
      $scope.pastlecturelist = lectures.past;
    })
  }

  $scope.lectureView = function(lecture) {
    $state.go('instructor', {'lectureId':lecture.id});
  }

  $scope.summaryView = function(lecture) {
    $state.go('summary', {'lectureId':lecture.id});
  }

  $scope.deleteLecture = LectureFactory.deleteLecture;

  $scope.createLectureModal = function() {

      console.log("emails: ", LectureFactory.instructorEmails);
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        transclude: true,
        dialogFade: false,
        keyboard: true,
        templateUrl : 'js/views/lecture/lectureModal.html',
        controller : CreateLectureInstance,
        resolve: {
          instructorEmails: function(){
            return LectureFactory.instructorEmails;
          }
        }
      })

    }

});

function CreateLectureInstance($scope, $uibModalInstance, $uibModal, LectureFactory) {

  $scope.instructorEmails = LectureFactory.instructorEmails;

  $scope.submitLecture = function() {
    console.log("check: ", LectureFactory.instructorEmails);
    if ($scope.lecture.lecturer) {
      LectureFactory.create($scope.lecture)
      .then(function(lecture) {
        $scope.createdLecture = lecture;
        $uibModalInstance.close();
      });
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  }
};
