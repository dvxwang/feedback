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
        curLecture: $scope.curLecture
      }
    })
  }

})

function ModalInstanceCtrl($scope, $uibModalInstance, $uibModal, PollFactory, curLecture) {

  $scope.submitPoll = function () {
    var poll = {}
    poll.question = $scope.newPoll
    poll.lectureId = curLecture.id
    poll.options = [$scope.a, $scope.b, $scope.c].filter(function(option) { return !!option })
    if (poll.options.length > 1) {
      PollFactory.createPoll(poll)
      .then(() => {
        $uibModalInstance.close()
        socket.emit('updatingPolls')
      })
    } else {
      alert("You must add at least 2 options to the poll!")
    }

  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  }
}
