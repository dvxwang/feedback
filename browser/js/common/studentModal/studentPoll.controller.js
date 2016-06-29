app.controller('StudentPoll', function($scope, $uibModal, LectureFactory) {

  $scope.showModal = function() {

    $scope.opts = {
      backdrop: true,
      backdropClick: true,
      transclude: true,
      dialogFade: false,
      keyboard: true,
      templateUrl : 'js/common/studentModal/studentPoll.html',
      controller : StudentModalInstance,
      resolve: {} // empty storage
    };

    $scope.opts.resolve.item = function() {
      return angular.copy({poll:$scope.poll}); // pass name to Dialog
    }

    var modalInstance = $uibModal.open($scope.opts);

    modalInstance.result.then(function(){
      //on ok button press
    },function(){
      //on cancel button press
    })
  }

  socket.on('toStudent', function(pollQuestion) {
    $scope.poll = pollQuestion
    $scope.showModal()
  })

})

function StudentModalInstance($scope, $uibModalInstance, $uibModal, item, PollFactory, PollAnswerFactory) {

  $scope.item = item;

  $scope.submitAnswer = function ($event) {
    var answer = {
      pollId: $scope.item.poll.id,
      option: $event.currentTarget.value
    }

    PollAnswerFactory.answerPoll(answer)
    .then(()=> {
      socket.emit('studentAnswer')
      $uibModalInstance.close()
    })
  }

}
