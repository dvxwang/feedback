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
      question: 'We would appreciate your feedback!',
      options: [
        'Do you find this tool useful? (yes/no)',
        'Is this better than the anonymous poll? (yes/no)',
        'Please leave anonymous feedback on what how we can improve:',
        'We would also appreciate in-person feedback. Please leave your name and/or email if you are ok with the development team reaching out. Thank you!'
      ],
      status: "sent"
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
