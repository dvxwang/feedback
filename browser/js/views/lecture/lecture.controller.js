app.controller('LectureController', function ($scope, $state, LectureFactory, $uibModal) {

  LectureFactory.activeList()
  .then((lecturelist)=> {
    $scope.activelecturelist = lecturelist;
  })

  LectureFactory.pastList()
  .then((lecturelist)=> {
    $scope.pastlecturelist = lecturelist;
  })

  $scope.lectureView = function(lecture) {
    $state.go('instructor', {'lectureId':lecture.id});
  }

  $scope.summaryView = function(lecture) {
    $state.go('summary', {'lectureId':lecture.id});
  }

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

    LectureFactory.create($scope.lectureName).then(function(lecture) {
      $scope.createdLecture = lecture;
    })
    .then(function(){
        $uibModalInstance.close();
    })
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  }
};
