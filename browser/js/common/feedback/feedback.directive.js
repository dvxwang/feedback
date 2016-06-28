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
        if ((category === 'Great' && !scope.greatClicked) || (category === 'Confused' && !scope.confusedClicked) || (category === 'Example' && !scope.exampleClicked) || (category === 'Cannot See' && !scope.seeClicked) || (category === 'Cannot Hear' && !scope.hearClicked) || (category === 'Request Break' && !scope.breakClicked)) {
        return FeedbackFactory.addFeedback(category)
        .then(function () {
          return FeedbackFactory.countFeedback(category)
        }) 
        .then(function (result) {
          socket.emit('submittedFeedback', category)
          
          console.log('IT IS HERE', result)
          if (category === 'Great') {
            scope.greatCount = result;
            scope.greatClicked = true
          }
          if (category === 'Confused') {
            scope.confusedCount = result;
            scope.confusedClicked = true
          }
          if (category === 'Example') {
            scope.exampleCount = result;
            scope.exampleClicked = true
          }
          if (category === 'Cannot See') {
            scope.seeCount = result
            scope.seeClicked = true
          }
          if (category === 'Cannot Hear') {
            scope.hearCount = result;
            scope.hearClicked = true;
          }
          if (category === 'Request Break') {
            scope.breakCount = result
            scope.breakClicked = true;
          }
        })
        .then(function () {
          scope.addMessage = true
          setTimeout(function(){
            scope.addMessage = false;
            scope.$digest();
          }, 1500);
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

    setInterval(function() {
      scope.greatCount = null;
      scope.greatClicked = null;
      scope.confusedCount = null;
      scope.confusedClicked = null;
      scope.exampleCount = null;
      scope.exampleClicked = null;
      scope.seeCount = null;
      scope.seeClicked = null;
      scope.hearCount = null;
      scope.hearClicked = null;
      scope.breakCount = null;
      scope.breakClicked = null;
      scope.$digest();
    }, 30*1000)

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
        // scope.$digest()
    })

  }
}
})
