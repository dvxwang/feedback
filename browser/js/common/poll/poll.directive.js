app.directive('poll', ($state, PollFactory) => {
  return {
    restrict: 'E',
    scope: {
      useCtrl: "@"
    },
    templateUrl: 'js/common/poll/poll.html',
    link: function(scope) {

      return PollFactory.getAllByLectureId(1)
      .then((currentPolls) => {
        scope.polls = currentPolls
      })

      scope.deletePoll = function(id) {
        PollFactory.deletePoll(id)
      }

    }
  }
})
