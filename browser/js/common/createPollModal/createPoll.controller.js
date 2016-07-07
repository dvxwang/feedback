app.controller('CreatePoll', ($scope, $uibModal) => {

  $scope.showModal = () => {
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

function ModalInstanceCtrl($scope, $uibModalInstance, PollFactory, curLecture) {

  $scope.submitPoll = () => {
    let poll = {
      question: $scope.newPoll,
      lectureId: curLecture.id,
      options: [$scope.a, $scope.b, $scope.c].filter(function(option) { return !!option })
    }

    if (poll.options.length > 1) {
      PollFactory.createPoll(poll)
      .then(() => {
        $uibModalInstance.close();
      });
    } else {
      alert("You must add at least 2 options to the poll!");
    }

  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  }
}
