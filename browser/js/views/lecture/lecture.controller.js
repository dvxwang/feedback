app.controller('LectureCtrl', function ($scope, $log, $state, LectureFactory, $uibModalInstance, $uibModal) {

  $scope.showLectureModal = function() {

      $scope.opts = {
      backdrop: true,
      backdropClick: true,
      transclude: true,
      dialogFade: false,
      keyboard: true,
      templateUrl : 'js/views/instructor/instructorModal.html',
      controller : LectureInstanceCtrl,
      resolve: {
        polls:$scope.polls,
        lecture: $scope.lecture
      }
        }

  $scope.createLecture = function() {
    $uibModal.open($scope.opts)
  }

  if ($(".start").html()=='Begin') {
      var modalInstance = $uibModal.open($scope.opts)
  }
  else {
      LectureFactory.setEnd().then(function() {
          $scope.curLecture = undefined;
          socket.emit('endingLecture');
          $scope.$evalAsync();
      })
      $(".start").html('Begin');
      $(".start").css('background-color', 'green')
  }

  }

})

var LectureInstanceCtrl = function($scope, $uibModalInstance, $uibModal, LectureFactory) {

$scope.submitLecture = function() {

  LectureFactory.setStart($scope.lectureName,$scope.lectureTeacher).then(function(lecture) {
      $scope.curLecture = lecture;
      socket.emit('startingLecture', lecture);
  })
  .then(function(){
      $uibModalInstance.close();
  })
};

$scope.cancel = function () {
  $uibModalInstance.dismiss('cancel');
}
}
