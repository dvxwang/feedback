app.directive('feedbackinstructor', ($state, FeedbackFactory, LectureFactory) => {
  return {
    restrict: 'E',
    scope: {
      admin: "@"
    },
    templateUrl: 'js/common/feedback/feedbackInstructor.html',
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
          (category === 'great' && !scope.greatClicked) || 
          (category === 'confused' && !scope.confusedClicked) || 
          (category === 'example' && !scope.exampleClicked) || 
          (category === 'see' && !scope.seeClicked) || 
          (category === 'hear' && !scope.hearClicked) || 
          (category === 'break' && !scope.breakClicked)) {
        
          return FeedbackFactory.addFeedback({category: category}, scope.currentLecture.id)
            .then(function (newFeedback) {

              let clickedCategory = category+'Clicked';

              scope[clickedCategory] = true;

              setTimeout(function () {
                scope[clickedCategory] = false
              }, 30*1000);              

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
    socket.on('updateFeedback', function(category, flag) {

        if (scope.admin && !flag) {
            var newNotification = new Notification("New Feedback", {body: category, tag: category});
            setTimeout(newNotification.close.bind(newNotification), 2000);
        };  

        return FeedbackFactory.countFeedback(category, scope.currentLecture.id)
        .then(function (feedbackCount) {

          let countCategory = category+'Count';

          if (feedbackCount === 0) scope[countCategory] = null
            else scope[countCategory] = feedbackCount

        })
        scope.$digest()
    })

  }
}
});

app.directive('feedbackstudent', ($state, FeedbackFactory, LectureFactory) => {
  return {
    restrict: 'E',
    scope: {
      admin: "@"
    },
    templateUrl: 'js/common/feedback/feedbackStudent.html',
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
          (category === 'great' && !scope.greatClicked) || 
          (category === 'confused' && !scope.confusedClicked) || 
          (category === 'example' && !scope.exampleClicked) || 
          (category === 'see' && !scope.seeClicked) || 
          (category === 'hear' && !scope.hearClicked) || 
          (category === 'break' && !scope.breakClicked)) {
        
          return FeedbackFactory.addFeedback({category: category}, scope.currentLecture.id)
            .then(function (newFeedback) {

              let clickedCategory = category+'Clicked';

              scope[clickedCategory] = true;

              setTimeout(function () {
                scope[clickedCategory] = false
              }, 30*1000);              

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
    socket.on('updateFeedback', function(category, flag) {

        if (scope.admin && !flag) {
            var newNotification = new Notification("New Feedback", {body: category, tag: category});
            setTimeout(newNotification.close.bind(newNotification), 2000);
        };  

        return FeedbackFactory.countFeedback(category, scope.currentLecture.id)
        .then(function (feedbackCount) {

          let countCategory = category+'Count';

          if (feedbackCount === 0) scope[countCategory] = null
            else scope[countCategory] = feedbackCount

        })
        scope.$digest()
    })

  }
}
});
