app.controller('CreatePoll', function($scope, $uibModal) {

  console.log("SCOPE", $scope.curLecture)
  console.log("PARENT", $scope.$parent.curLecture)

  $scope.showModal = function() {
    $scope.opts = {
      backdrop: true,
      backdropClick: true,
      transclude: true,
      dialogFade: false,
      keyboard: true,
      templateUrl : 'js/common/createPollModal/createPollModal.html',
      controller : ModalInstanceCtrl
    }

    $scope.opts.resolve.lecture = function() {
        return angular.copy($scope.curLecture); // pass name to Dialog
    }

    $uibModal.open($scope.opts)
  }

})

function ModalInstanceCtrl($scope, $uibModalInstance, $uibModal, PollFactory) {
  console.log($scope.lecture)
  $scope.submitPoll = function () {
    var poll = {}
    poll.question = $scope.newPoll
    poll.lectureId = $scope.lecture.id
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
