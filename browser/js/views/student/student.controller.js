app.controller('StudentCtrl', function($scope, LectureFactory, $uibModal, curLecture) {

  //Init page lecture
  $scope.curLecture = curLecture;

  //Triggers end of lecture modal
  function showSurveyModal() {
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

  //Creates end of survey modal
  function SurveyModalInstance($scope, $uibModalInstance, $uibModal, curLecture, PollFactory, FeedbackFactory) {

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

    //Submit end of lecture feedback
    $scope.submit = function() {
      var endLectureFeedback = $scope.poll.options.map(function(result) {
        return FeedbackFactory.addFeedback(result, $scope.curLecture.id)
      });
      $uibModalInstance.close();
      return Promise.all(endLectureFeedback);
    }
  }
  
  //Listening for starting/ending events
  socket.on('startLecture', function(lecture) {
    $scope.curLecture = lecture;
  })

  socket.on('endLecture', function() {
    showSurveyModal();
    $scope.curLecture = undefined;
  })
})
