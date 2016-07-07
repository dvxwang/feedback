app.controller('StudentPoll', ($scope, $uibModal, $uibModalStack) => {

  $scope.showModal = () => {
    $uibModalStack.dismissAll();
    $uibModal.open({
      backdrop: true,
      backdropClick: true,
      transclude: true,
      dialogFade: false,
      keyboard: true,
      templateUrl : 'js/common/studentModal/studentPoll.html',
      controller : StudentModalInstance,
      resolve: {
        poll: $scope.poll,
        curLecture: $scope.curLecture
      },
    })
  }

  socket.on('toStudent', (pollQuestion) => {
    $scope.poll = pollQuestion;
    $scope.showModal();
  })

})

function StudentModalInstance($scope, $uibModalInstance, PollAnswerFactory, curLecture, poll) {

  $scope.poll = poll;
  $scope.curLecture = curLecture;

  $scope.submitAnswer = ($event) => {
    let answer = {
      pollId: $scope.poll.id,
      option: $event.currentTarget.value
    }

    PollAnswerFactory.answerPoll(answer)
    .then(() => {
      $uibModalInstance.close();
    });
  }

}
