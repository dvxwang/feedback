app.controller('StudentCtrl', function($scope, LectureFactory, curLecture) {
  $scope.curLecture = curLecture;
  
  socket.on('startLecture', function(lecture) {
    $scope.curLecture = lecture;
    $scope.$evalAsync()
  })

  socket.on('endLecture', function() {
    $scope.curLecture = undefined;
    $scope.$evalAsync()
  })

})