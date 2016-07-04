app.controller('CreatePoll', function($scope, $uibModal) {

  $scope.showModal = function() {
    $uibModal.open({
      backdrop: true,
      backdropClick: true,
      transclude: true,
      dialogFade: false,
      keyboard: true,
      templateUrl : 'js/common/createPollModal/createPollModal.html',
      controller : ModalInstanceCtrl,
      resolve: {
        lecture: $scope.$parent.curLecture
      }
    })
  }

})

var ModalInstanceCtrl = function($scope, $uibModalInstance, $uibModal, PollFactory, lecture) {

  $scope.submitPoll = function () {
    var poll = {}
    poll.question = $scope.newPoll
    poll.lectureId = lecture.id
    poll.options = [$scope.a, $scope.b, $scope.c].filter(function(option) { return !!option })
    if (poll.options.length > 1) {
      PollFactory.createPoll(poll)
      .then(function() { $uibModalInstance.close() })
    } else {
      alert("You must add at least 2 options to the poll!")
    }

  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  }
}
