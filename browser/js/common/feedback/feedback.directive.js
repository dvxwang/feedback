app.directive('feedback', ($state, FeedbackFactory, LectureFactory) => {
  return {
    restrict: 'E',
    scope: {
      admin: "@"
    },
    templateUrl: 'js/common/feedback/feedback.html',
    link: (scope) => {

      socket.emit('getFeedback'); //on instructor or student window load, auto-updates feedback button badges with most current feedback count

      scope.clickedMessage = false;
      scope.rejectClickMessage = false;

      scope.currentLecture = scope.$parent.curLecture;

      scope.submitFeedback = (category) => {
        //instructor clears feedback on pressing feedback button
        if (scope.admin) {
          return FeedbackFactory.addFeedback({
            category: category, 
            comment: 'adminReset'},
            scope.currentLecture.id);
        }
        //student generates new feedback in database on pressing feedback button, but allowed once per 30s per feedback category
        else if (
          (category === 'Great' && !scope.greatClicked) || 
          (category === 'Confused' && !scope.confusedClicked) || 
          (category === 'Example' && !scope.exampleClicked) || 
          (category === 'Cannot See' && !scope.seeClicked) || 
          (category === 'Cannot Hear' && !scope.hearClicked) || 
          (category === 'Request Break' && !scope.breakClicked)) {
        
          return FeedbackFactory.addFeedback({category: category}, scope.currentLecture.id)
            .then(function () {

            switch(category) {

              case "Great":
                scope.greatClicked = true;
                setTimeout(function () {
                  scope.greatClicked = false
                }, 30*1000)
                break;

              case "Confused":
                scope.confusedClicked = true
                setTimeout(function () {
                  scope.confusedClicked = false
                }, 30*1000);
                break;

              case "Example":
                scope.exampleClicked = true
                setTimeout(function () {
                  scope.exampleClicked = false
                }, 30*1000);
                break;
              
              case "Cannot See":
                scope.seeClicked = true
                setTimeout(function () {
                  scope.seeClicked = false
                }, 30*1000);
                break;

              case "Cannot Hear":
                scope.hearClicked = true;
                setTimeout(function () {
                  scope.hearClicked = false
                }, 30*1000);
                break;
              
              case "Request Break":
                scope.breakClicked = true;
                setTimeout(function () {
                  scope.breakClicked = false
                }, 30*1000);
                break;
            }
        })
        //message confirming new feedback submitted
        .then(function () {
          scope.clickedMessage = true
          setTimeout(function(){
            scope.clickedMessage = false;
            scope.$digest();
          }, 1500);
        });
      }
      //message rejecting new feedback submission attempt if still within 30s timeout
      else {
        scope.rejectClickMessage = true
        setTimeout(function(){
          scope.rejectClickMessage = false;
          scope.$digest();
        }, 1500);
      };
    }

    //updates badge counts on feedback buttons when a valid new feedback is submitted
    socket.on('updateFeedback', function(category,flag) {

        if (scope.admin && !flag) {
            console.log("David: ",flag);
            new Notification("New Feedback", {body: category});
        };  

        return FeedbackFactory.countFeedback(category, scope.currentLecture.id)
        .then(function (result) {

          switch(category) {

            case 'Great':
              if (result === 0) scope.greatCount = null
              else scope.greatCount = result
              break;

            case 'Confused':
              if (result === 0) scope.confusedCount = null
              else scope.confusedCount = result
              break;
            
            case 'Example':
              if (result === 0) scope.exampleCount = null
              else scope.exampleCount = result
              break;
            
            case 'Cannot See':
              if (result === 0) scope.seeCount = null
              else scope.seeCount = result
              break;
            
            case 'Cannot Hear':
              if (result === 0) scope.hearCount = null
              else scope.hearCount = result
              break;
            
            case 'Request Break':
              if (result === 0) scope.breakCount = null
              else scope.breakCount = result          
              break;
          }
        })
        scope.$digest()
    })

  }
}
});
