app.directive('poll', ($state, PollFactory, LectureFactory) => {
  return {
    restrict: 'E',
    templateUrl: 'js/common/poll/poll.html',
    link: function(scope) {
      scope.curLecture = scope.$parent.curLecture

      PollFactory.getAllByLectureId(scope.curLecture.id)
      .then((polls) => scope.polls = polls)

      scope.sendPoll = function(poll) {
        if (poll.status === "pending") {
          return PollFactory.updatePoll(poll, { status: "sent"})
        }
      }

      scope.delete = function(poll) {
        return PollFactory.deletePoll(poll);
      }

      socket.on('updatePolls', function() {
        return PollFactory.getAllByLectureId(scope.curLecture.id)
        .then((polls) => {
          scope.polls = polls
        })
      })

    }
  }
})
