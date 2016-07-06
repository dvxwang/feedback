app.controller('SummaryCtrl', function($scope, SummaryFactory, lecture) {

  $scope.lecture = lecture;

  SummaryFactory.returnFeedBackJSON()
  .then((feedback)=> {
    $scope.feedBackJSON = feedback
    console.log($scope.feedBackJSON)
  })

});
