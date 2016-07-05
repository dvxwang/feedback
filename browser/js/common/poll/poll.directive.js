app.directive('poll', ($state, PollFactory, LectureFactory) => {
  return {
    restrict: 'E',
    templateUrl: 'js/common/poll/poll.html',
    link: function(scope) {
      scope.curLecture = scope.$parent.curLecture

      PollFactory.getAllByLectureId(scope.curLecture.id)
      .then((polls) => {
        scope.polls = polls

        if (!scope.polls.favorite.length) {
          return PollFactory.createPoll({
            question: 'Are you confused?',
            options: [
              'Yes',
              'No',
              'Sort of'
            ],
            status: "favorite",
            lectureId: scope.curLecture.id
          })
        }
      })

      scope.delete = PollFactory.deletePoll

      scope.sendPoll = function(poll) {
        socket.emit('pollOut', poll)
        if (poll.status === "pending") {
          return PollFactory.updatePoll(poll, { status: "sent"})
        }
      }

    }
  }
})
