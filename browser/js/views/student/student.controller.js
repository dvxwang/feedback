app.controller('StudentCtrl', function($scope, LectureFactory, $uibModal) {
  socket.emit('gettingLecture')
  socket.on('getLecture', function(lecture) {
    $scope.curLecture = lecture
    $scope.$evalAsync()
  })
  
  socket.on('startLecture', function(lecture) {
    $scope.curLecture = lecture;
    $scope.$evalAsync()
  })

  socket.on('endLecture', function() {
    $scope.showSurveyModal()
    $scope.curLecture = undefined;
    $scope.$evalAsync()
  })

  $scope.showSurveyModal = function() {
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
    $scope.curLecture = curLecture

    PollFactory.createPoll({
      question: 'What do you think of Feedback?',
      options: [
        'What do you think of the UI?',
        'How are the buttons?',
        'Did this help you in class?',
        'Anything else?'
      ]
    }).then(function(poll) {
      $scope.poll = poll;
      $scope.poll.options = poll.options.map(function(question) {
        return { category: question }
      })
    })

    $scope.submit = function() {
      var promises = $scope.poll.options.map(function(result) {
        return FeedbackFactory.addFeedback(result, $scope.curLecture.id)
      })
      $uibModalInstance.close()
      return Promise.all(promises)
    }
  }

})