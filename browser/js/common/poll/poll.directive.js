app.directive('poll', ($state, PollFactory, LectureFactory) => {
  return {
    restrict: 'E',
    templateUrl: 'js/common/poll/poll.html',
    link: function(scope) {
      scope.curLecture = scope.$parent.curLecture

      PollFactory.getAllByLectureId(scope.curLecture.id)
      .then((polls) => scope.polls = polls)

      scope.sendPoll = (poll) => PollFactory.updatePoll(poll, { status: 'sent', lectureId: scope.curLecture.id })

      scope.delete = function(poll) {
        return PollFactory.deletePoll(poll);
      };

      socket.on('updatePolls', function() {
        return PollFactory.getAllByLectureId(scope.curLecture.id)
        .then((polls) => {
          scope.polls = polls
        })
      })

    }
  }
})
