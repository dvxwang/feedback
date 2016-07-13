app.controller('StudentCtrl', function($scope, LectureFactory, $uibModal, curLecture, $state, $uibModalStack) {

  $scope.curLecture = curLecture;
  
  socket.on('startLecture', function(lecture) {
    // $state.reload();
    $scope.curLecture = lecture;
    $scope.$evalAsync();
  })

  socket.on('endLecture', function() {
    $state.reload();
    showSurveyModal();
  })

  function showSurveyModal() {
    $uibModalStack.dismissAll();
    $uibModal.open({
      backdrop: true,
      backdropClick: true,
      transclude: true,
      dialogFade: false,
      keyboard: true,
      templateUrl : 'js/views/student/surveyModal.html',
      controller : SurveyModalInstance,
      resolve: {
        curLecture: $scope.curLecture
      }
    })
  }

  function SurveyModalInstance($scope, $uibModalInstance, $uibModal, curLecture, PollFactory, FeedbackFactory) {
    
    $scope.curLecture = curLecture;

    PollFactory.createPoll({
      question: 'We would appreciate your feedback!',
      options: [
        'How would you rate this lecture?'
      ],
      status: 'sent',
      lectureId: $scope.curLecture.id
    })
    .then(function(poll) {
      $scope.poll = poll;
      $scope.poll.options = poll.options.map(function(question) {
        return { category: question };
      })
    })

    $scope.itemClicked = function (index, option) {
      option.index = index;
      option.comment = index;
    }

    $scope.submit = function() {
      var endLectureFeedback = $scope.poll.options.map(function(result) {
        return FeedbackFactory.addFeedback(result, $scope.curLecture.id)
      });
      $uibModalInstance.close();
      return Promise.all(endLectureFeedback);
    }
  }

})