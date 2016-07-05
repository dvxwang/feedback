app.directive('feedback', ($state, FeedbackFactory, LectureFactory) => {
  return {
    restrict: 'E',
    scope: {
      admin: "@"
    },
    templateUrl: 'js/common/feedback/feedback.html',
    link: (scope) => {
      scope.addMessage = false;
      scope.rejectMessage = false;

      scope.submitFeedback = function (category) {
        console.log("Submitted: ",category);
        if (scope.admin) {
          return FeedbackFactory.addFeedback({'category': category, comment: 'adminReset'}, scope.$parent.curLecture.id)
          .then(function () {
            socket.emit('submittedFeedback', {'category': category, comment: 'adminReset'});
          })
        }

        if ((category === 'Great' && !scope.greatClicked) || (category === 'Confused' && !scope.confusedClicked) || (category === 'Example' && !scope.exampleClicked) || (category === 'Cannot See' && !scope.seeClicked) || (category === 'Cannot Hear' && !scope.hearClicked) || (category === 'Request Break' && !scope.breakClicked)) {
        return FeedbackFactory.addFeedback({'category': category}, scope.$parent.curLecture.id)
        .then(function () {
          socket.emit('submittedFeedback', {'category': category})
          
          if (category === 'Great') {
            scope.greatClicked = true;
            setTimeout(function () {
              scope.greatClicked = false
            }, 30*1000)
          }
          if (category === 'Confused') {
            scope.confusedClicked = true
            setTimeout(function () {
              scope.confusedClicked = false
            }, 30*1000)
          }
          if (category === 'Example') {
            scope.exampleClicked = true
            setTimeout(function () {
              scope.exampleClicked = false
            }, 30*1000)
          }
          if (category === 'Cannot See') {
            scope.seeClicked = true
            setTimeout(function () {
              scope.seeClicked = false
            }, 30*1000)
          }
          if (category === 'Cannot Hear') {
            scope.hearClicked = true;
            setTimeout(function () {
              scope.hearClicked = false
            }, 30*1000)
          }
          if (category === 'Request Break') {
            scope.breakClicked = true;
            setTimeout(function () {
              scope.breakClicked = false
            }, 30*1000)
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

    socket.on('updateFeedback', function(feedbackObj) {
        feedbackObj.category = feedbackObj.category.charAt(0).toUpperCase() + feedbackObj.category.slice(1);
        console.log("Feedback Obj: ",feedbackObj);
        return FeedbackFactory.countFeedback(feedbackObj.category, scope.$parent.curLecture.id) 
        .then(function (result) {          
          console.log("Feedback 2: ",result);
          if (feedbackObj.category === 'Great') {
            if (result === 0) {
              scope.greatCount = null
            }
            else scope.greatCount = result
          }
          if (feedbackObj.category === 'Confused') {
            if (result === 0) {
              scope.confusedCount = null
            }
            else scope.confusedCount = result
          }
          if (feedbackObj.category === 'Example') {
            if (result === 0) {
              scope.exampleCount = null
            }
            else scope.exampleCount = result
          }
          if (feedbackObj.category === 'Cannot See') {
            if (result === 0) {
              scope.seeCount = null
            }
            else scope.seeCount = result
          }
          if (feedbackObj.category === 'Cannot Hear') {
            if (result === 0) {
              scope.hearCount = null
            }
            else scope.hearCount = result
          }
          if (feedbackObj.category === 'Request Break') {
            if (result === 0) {
              scope.breakCount = null
            }
            else scope.breakCount = result          }
        })
        scope.$digest()
    })

  }
}
})
