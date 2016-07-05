app.directive('poll', ($state, PollFactory, LectureFactory) => {
  return {
    restrict: 'E',
    templateUrl: 'js/common/poll/poll.html',
    link: function(scope) {
      scope.curLecture = scope.$parent.curLecture // this is simply to pass it along to the createPoll controller

      PollFactory.getAllByLectureId(scope.curLecture.id)
      .then((currentPolls) => {
        scope.polls = currentPolls
      })

      scope.delete = PollFactory.deletePoll

      scope.sendPoll = function(poll) {
        PollFactory.updatePoll(poll.id, { status: "sent"})
        .then(()=> {
          socket.emit('pollOut', poll)
        })
      }

    }
  }
})
