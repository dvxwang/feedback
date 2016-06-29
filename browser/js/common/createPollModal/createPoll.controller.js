app.controller('CreatePoll', function($scope, $uibModal) {

  $scope.showModal = function() {

    $scope.opts = {
    backdrop: true,
    backdropClick: true,
    transclude: true,
    dialogFade: false,
    keyboard: true,
    templateUrl : 'js/common/createPollModal/createPollModal.html',
    controller : ModalInstanceCtrl,
    resolve: {} // empty storage
      };

    $scope.opts.resolve.item = function() {
        return angular.copy({polls:$scope.polls}); // pass name to Dialog
    }

      var modalInstance = $uibModal.open($scope.opts);

      modalInstance.result.then(function(){
        //on ok button press
      },function(){
        //on cancel button press
      })
  }

})

var ModalInstanceCtrl = function($scope, $uibModalInstance, $uibModal, item, PollFactory) {

  $scope.item = item;

  // $scope.customOptions = function(option) {
  //   $scope.customShow = (option === 'custom')
  // }

  $scope.submitPoll = function () {
    var poll = {}
    poll.question = $scope.newPoll
    poll.lectureId = $scope.lecture.id
    // poll.options = [{'a': $scope.a}, {'b': $scope.b}, {'c': $scope.c}]
    poll.options = [$scope.a, $scope.b, $scope.c]
    var check = poll.options.reduce(function(prev, next) { return prev && (next != undefined || next != null)}, true)
    if (check) {
      PollFactory.createPoll(poll)
      .then(function() { return PollFactory.getAllByLectureId(1) })
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
