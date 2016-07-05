app.controller('StudentPoll', function($scope, $uibModal, LectureFactory) {

  $scope.showModal = function() {
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

  socket.on('toStudent', function(pollQuestion) {
    $scope.poll = pollQuestion
    $scope.showModal()
  })

})

function StudentModalInstance($scope, $uibModalInstance, $uibModal, PollFactory, PollAnswerFactory, curLecture, poll) {

  $scope.poll = poll
  $scope.curLecture = curLecture

  $scope.submitAnswer = function ($event) {
    var answer = {
      pollId: $scope.poll.id,
      option: $event.currentTarget.value
    }

    PollAnswerFactory.answerPoll(answer)
    .then(function() {
      socket.emit('studentAnswer')
      $uibModalInstance.close()
    })
  }

}
