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
    poll.options = [$scope.a, $scope.b, $scope.c]
    var check = poll.options.reduce(function(prev, next) { return prev && (next != undefined || next != null)}, true)
    if (check) {
      PollFactory.createPoll(poll)
      .then(function() { return PollFactory.getAllByLectureId(poll.lectureId) })
      .then((polls) => { $scope.polls = polls })
      .then(function() { $uibModalInstance.close() })
    } else {
      alert("You must add at least one question to the poll!")
    }

  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  }
}
