app.directive('activePoll', ($state, PollFactory, PollAnswerFactory) => {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/livePoll/activePoll.html',
    link: function(scope) {
      socket.on('toStudent', function(pollQuestion) {
        console.log("hello")
        scope.poll = pollQuestion
        scope.$digest()
      })
      // PollAnswerFactory.getAllByPollId(scope.poll.id)
      // .then((answers)=> {
      //   scope.answers = answers
      // })
      socket.on('updateActivePoll', function() {
        PollAnswerFactory.getAllByPollId(scope.poll.id)
        .then((answers)=> {
          scope.answers = answers
          scope.counted = countAnswers(scope.answers)
        })
        scope.$digest()
      })

      function countAnswers(answers) {
        var counted = {}
        answers.forEach(function(answer) {
          if (!counted[answer.option]) counted[answer.option] = 1
          else counted[answer.option] += 1
        })
        return counted
      }
    }
  }
})
