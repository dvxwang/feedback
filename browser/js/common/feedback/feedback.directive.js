app.directive('feedback', ($state, FeedbackFactory) => {
  return {
    restrict: 'E',
    scope: {

    },
    templateUrl: 'js/common/feedback/feedback.html',
    link: (scope) => {
      scope.addMessage = false;

      scope.countFeedback = function (category) {
        return FeedbackFactory.addFeedback(category)
        .then(function () {
          return FeedbackFactory.countFeedback(category)
        }) 
        .then(function (result) {
          console.log('IT IS HERE', result)
          if (category === 'Great') {
            scope.greatCount = result
          }
          if (category === 'Confused') {
            scope.confusedCount = result
          }
          if (category === 'Example') {
            scope.exampleCount = result
          }
        })
        .then(function () {
          scope.addMessage = true
          setTimeout(function(){
            scope.addMessage = false;
            scope.$digest();
          }, 1000);
        })
        .then(function () {
          setTimeout(function() {
            scope.greatCount = null
            scope.confusedCount = null
            scope.exampleCount = null
            scope.$digest();
          }, 30*1000)
        })
      }
  }
}
})
