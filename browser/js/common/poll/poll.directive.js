app.directive('poll', ($state, PollFactory) => {
  return {
    restrict: 'E',
    scope: {

    },
    templateUrl: 'js/common/poll/poll.html',
    link: (scope) => {
      PollFactory.getAllByLectureId(1)
      .then((polls) => {
        scope.polls = polls
      })
    }
  }
})
