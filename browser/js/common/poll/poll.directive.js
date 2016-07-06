app.directive('poll', (PollFactory, LectureFactory) => {
  return {
    restrict: 'E',
    templateUrl: 'js/common/poll/poll.html',
    scope: {},
    link: function(scope) {
      scope.curLecture = scope.$parent.curLecture

      PollFactory.getAllByLectureId(scope.curLecture.id)
      .then((polls) => scope.polls = polls)

      scope.delete = function(poll) {
        return PollFactory.deletePoll(poll)
        .then(() => socket.emit('updatingPolls'))
      }

      scope.sendPoll = function(poll) {
        if (poll.status === "pending") {
          return PollFactory.updatePoll(poll, { status: "sent"}).then(() => socket.emit('pollOut', poll))
        }
        socket.emit('pollOut', poll)
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
