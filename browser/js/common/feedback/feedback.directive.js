app.directive('feedback', ($state, FeedbackFactory) => {
  return {
    restrict: 'E',
    scope: {

    },
    templateUrl: 'js/common/feedback/feedback.html',
    link: (scope) => {
      scope.addMessage = false;
      scope.rejectMessage = false;

      scope.countFeedback = function (category) {
        if ((category === 'Great' && !scope.greatCount) || (category === 'Confused' && !scope.confusedCount) || (category === 'Example' && !scope.exampleCount) || (category === 'Cannot See' && !scope.seeCount) || (category === 'Cannot Hear' && !scope.hearCount) || (category === 'Request Break' && !scope.breakCount)) {
        return FeedbackFactory.addFeedback(category)
        .then(function () {
          return FeedbackFactory.countFeedback(category)
        }) 
        .then(function (result) {
          socket.emit('submittedFeedback', category)
          
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
          if (category === 'Cannot See') {
            scope.seeCount = result
          }
          if (category === 'Cannot Hear') {
            scope.hearCount = result
          }
          if (category === 'Request Break') {
            scope.breakCount = result
          }
        })
        .then(function () {
          scope.addMessage = true
          setTimeout(function(){
            scope.addMessage = false;
            scope.$digest();
          }, 1500);
        })
        .then(function () {
          setTimeout(function() {
            scope.greatCount = null;
            scope.confusedCount = null;
            scope.exampleCount = null;
            scope.seeCount = null;
            scope.hearCount = null;
            scope.breakCount = null;
            scope.$digest();
          }, 30*1000)
        })
      }

      else {
        scope.rejectMessage = true
        setTimeout(function(){
          scope.rejectMessage = false;
          scope.$digest();
        }, 1500);        
      }
    }

    socket.on('updateFeedback', function(category) {
        console.log('received -->', category)

        return FeedbackFactory.countFeedback(category) 
        .then(function (result) {          
          if (category === 'Great') {
            scope.greatCount = result
          }
          if (category === 'Confused') {
            scope.confusedCount = result
          }
          if (category === 'Example') {
            scope.exampleCount = result
          }
          if (category === 'Cannot See') {
            scope.seeCount = result
          }
          if (category === 'Cannot Hear') {
            scope.hearCount = result
          }
          if (category === 'Request Break') {
            scope.breakCount = result
          }
        })
        .then(function () {
          setTimeout(function() {
            scope.greatCount = null;
            scope.confusedCount = null;
            scope.exampleCount = null;
            scope.seeCount = null;
            scope.hearCount = null;
            scope.breakCount = null;
            scope.$digest();
          }, 30*1000)
        })
        // scope.$digest()
    })

  }
}
})
