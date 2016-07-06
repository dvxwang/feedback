app.controller('SummaryCtrl', function($scope, SummaryFactory, lecture) {

  $scope.lecture = lecture;
  console.log($scope.lecture)

  SummaryFactory.returnFeedBackJSON()
  .then((feedback) => {
    $scope.feedBackJSON = feedback
    console.log($scope.feedBackJSON)
  })

});
