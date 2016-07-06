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
      socket.emit('getFeedback')
      console.log("currentLectureparent", scope.$parent.curLecture)
      scope.currentLecture = scope.$parent.curLecture

      scope.submitFeedback = function (category) {

        if (scope.admin) {
          return FeedbackFactory.addFeedback({category: category, comment: 'adminReset'}, scope.$parent.curLecture.id);
          // .then(function () {
          //   socket.emit('submittedFeedback', category)
          // })
        }

        if ((category === 'Great' && !scope.greatClicked) || (category === 'Confused' && !scope.confusedClicked) || (category === 'Example' && !scope.exampleClicked) || (category === 'Cannot See' && !scope.seeClicked) || (category === 'Cannot Hear' && !scope.hearClicked) || (category === 'Request Break' && !scope.breakClicked)) {
        return FeedbackFactory.addFeedback({category: category}, scope.currentLecture.id)
        .then(function () {
          socket.emit('submittedFeedback', category)

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


    // socket.on('feedbackRefresh', function() {
    //     if (scope.$parent.curLecture) {
    //       FeedbackFactory.countFeedback('Great', scope.$parent.curLecture.id)
    //       .then(function (result) {
    //           if (result === 0) scope.greatCount = null
    //             else scope.greatCount = result
    //       })
    //       FeedbackFactory.countFeedback('Confused', scope.$parent.curLecture.id)
    //       .then(function (result) {
    //           if (result === 0) scope.confusedCount = null
    //             else scope.confusedCount = result
    //       })
    //       FeedbackFactory.countFeedback('Example', scope.$parent.curLecture.id)
    //       .then(function (result) {
    //           if (result === 0) scope.exampleCount = null
    //             else scope.exampleCount = result
    //       })
    //       FeedbackFactory.countFeedback('Cannot See', scope.$parent.curLecture.id)
    //       .then(function (result) {
    //           if (result === 0) scope.seeCount = null
    //             else scope.seeCount = result
    //       })
    //       FeedbackFactory.countFeedback('Cannot Hear', scope.$parent.curLecture.id)
    //       .then(function (result) {
    //           if (result === 0) scope.hearCount = null
    //             else scope.hearCount = result
    //       })
    //       FeedbackFactory.countFeedback('Request Break', scope.$parent.curLecture.id)
    //       .then(function (result) {
    //           if (result === 0) scope.breakCount = null
    //             else scope.breakCount = result
    //       })

    //       scope.$digest();
    //     }
    // })


    socket.on('updateFeedback', function(category) {

        return FeedbackFactory.countFeedback(category, scope.currentLecture.id)
        .then(function (result) {
          if (category === 'Great') {
            if (result === 0) {
              scope.greatCount = null
            }
            else scope.greatCount = result
          }
          if (category === 'Confused') {
            if (result === 0) {
              scope.confusedCount = null
            }
            else scope.confusedCount = result
          }
          if (category === 'Example') {
            if (result === 0) {
              scope.exampleCount = null
            }
            else scope.exampleCount = result
          }
          if (category === 'Cannot See') {
            if (result === 0) {
              scope.seeCount = null
            }
            else scope.seeCount = result
          }
          if (category === 'Cannot Hear') {
            if (result === 0) {
              scope.hearCount = null
            }
            else scope.hearCount = result
          }
          if (category === 'Request Break') {
            if (result === 0) {
              scope.breakCount = null
            }
            else scope.breakCount = result          }
        })
        scope.$digest()
    })

  }
}
});
