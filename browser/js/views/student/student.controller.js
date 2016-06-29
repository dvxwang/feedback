app.controller('StudentCtrl', function($scope, LectureFactory) {
  socket.emit('gettingLecture')
  socket.on('getLecture', function(lecture) {
    $scope.curLecture = lecture
    $scope.$evalAsync()
  })
  
  socket.on('startLecture', function(lecture) {
    $scope.curLecture = lecture;
    $scope.$evalAsync()
  })

  socket.on('endLecture', function() {
    $scope.curLecture = undefined;
    $scope.$evalAsync()
  })

})