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

  $scope.customOptions = function(option) {
    $scope.customShow = (option === 'custom')
  }

  $scope.submitPoll = function () {
    var poll = {}
    poll.question = $scope.newPoll
    poll.lectureId = 1
    if ($scope.option=='custom') poll.options = [$scope.a, $scope.b, $scope.c, $scope.d]

    PollFactory.createPoll(poll)
    .then(() => { return PollFactory.getAllByLectureId(1) })
    .then((polls) => { $scope.polls = polls })
    .then(() => { $uibModalInstance.close() })
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  }
}
