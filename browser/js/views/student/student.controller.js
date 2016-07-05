app.controller('StudentCtrl', function($scope, LectureFactory, $uibModal) {
  socket.emit('gettingLecture')
  socket.emit('submittedFeedback')

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
        'How would you rate this lecture?',
        'What about now?'
      ]
    }).then(function(poll) {
      $scope.poll = poll;
      $scope.poll.options = poll.options.map(function(question) {
        return { category: question }
      })
    })

    $scope.selectedIndex = -1;
    $scope.selectedRepeat = -1; // Whatever the default selected index is, use -1 for no selection
    $scope.starredArr = [null, null]

    $scope.itemClicked = function (index, question, $index) {
      console.log('HERE', $index)
      question.index = index;
      $scope.selectedRepeat = $index
      $scope.starredArr[$index] = true;
      question.comment = index
      console.log('AND HERE', $scope.starredArr)
    }

    $scope.submit = function() {
      var promises = $scope.poll.options.map(function(result) {
        return FeedbackFactory.addFeedback(result, $scope.curLecture.id)
      })
      $uibModalInstance.close()
      return Promise.all(promises)
    }
  }

})
