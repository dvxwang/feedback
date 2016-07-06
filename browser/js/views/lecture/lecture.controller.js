app.controller('LectureController', function ($scope, $state, LectureFactory, $uibModal) {

  LectureFactory.list()
  .then((lecturelist)=> {
    console.log("lecturelist", lecturelist)
    $scope.lecturelist = lecturelist
  })

  $scope.lectureView = function(lecture) {
    console.log(lecture)
    $state.go('instructor', {'lecture':lecture})
    socket.emit('gettingLecture', lecture)
  }

  $scope.createLectureModal = function() {

      $scope.opts = {
      backdrop: true,
      backdropClick: true,
      transclude: true,
      dialogFade: false,
      keyboard: true,
      templateUrl : 'js/views/lecture/lectureModal.html',
      controller : CreateLeactureInstance,
      resolve: {}
      }

      $uibModal.open($scope.opts)

    }

});

function CreateLeactureInstance($scope, $uibModalInstance, $uibModal, LectureFactory) {

  $scope.submitLecture = function() {

    LectureFactory.create($scope.lectureName).then(function(lecture) {
      $scope.createdLecture = lecture
        // $scope.curLecture = lecture;
        // socket.emit('startingLecture', lecture);
    })
    .then(function(){
        $uibModalInstance.close();
    })
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  }
};
