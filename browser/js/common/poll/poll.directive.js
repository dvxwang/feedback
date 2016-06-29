app.directive('poll', ($state, PollFactory, LectureFactory) => {
  return {
    restrict: 'E',
    scope: {
      admin: '@',
      lecture: '='
    },
    templateUrl: 'js/common/poll/poll.html',
    link: function(scope) {

      PollFactory.getAllByLectureId(scope.lecture.id)
      .then((currentPolls) => {
        scope.polls = currentPolls
      })

      scope.delete = PollFactory.deletePoll

      scope.sendPoll = function(poll) {
        poll.sent = "sent"
        PollFactory.markSent(poll)
        .then((currentPolls)=> {
          scope.polls = currentPolls
        })
        .then(()=> {
          socket.emit('pollOut', poll)
        })
        scope.$digest()
      }

    }
  }
})
