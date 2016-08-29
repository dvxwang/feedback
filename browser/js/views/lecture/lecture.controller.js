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

      $uibModal.open({
      backdrop: true,
      backdropClick: true,
      transclude: true,
      dialogFade: false,
      keyboard: true,
      templateUrl : 'js/views/lecture/lectureModal.html',
      controller : CreateLeactureInstance,
      resolve: {}
      })

    }

});

function CreateLeactureInstance($scope, $uibModalInstance, $uibModal, LectureFactory) {

  $scope.submitLecture = function() {

    if ($scope.lectureEmail) {
      LectureFactory.create({
        name: $scope.lectureName,
        lecturer: $scope.lectureEmail
      })
      .then(function(lecture) {
        $scope.createdLecture = lecture;
      })
      .then(function(){
          $uibModalInstance.close();
      })
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  }
};
