app.directive('poll', ($state, PollFactory) => {
  return {
    restrict: 'E',
    scope: {
      useCtrl: "@"
    },
    templateUrl: 'js/common/poll/poll.html',
    link: function(scope) {

      scope.delete = PollFactory.deletePoll

      PollFactory.getAllByLectureId(1)
      .then((currentPolls) => {
        scope.polls = currentPolls
      })

      scope.sendPoll = function(poll) {
        socket.emit('pollOut', poll)
      }

    }
  }
})
