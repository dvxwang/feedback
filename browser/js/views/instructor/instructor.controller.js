app.controller('InstructorCtrl', function ($scope, $log, $state, LectureFactory, $stateParams, curLecture) {

    $scope.curLecture = curLecture;

    $scope.startLecture = function() {
      if ($(".start").html()=='Begin') {
          LectureFactory.setStart($scope.curLecture)
          .then(function(lecture) {
            // moved to backend
            socket.emit('startingLecture', lecture);
          })
      } else {
          LectureFactory.setEnd($scope.curLecture).
          then(function() {
            $state.go('lecture')
          })
      }
    }

    socket.on('startLecture', function(lecture) {
      instructorChart()
      $(".start").html("Stop");
      $(".start").css('background-color', 'red');
      $scope.$evalAsync();
    })

    $(document).ready(function() {


        gapi.hangout.render('startButton2', {
        'render': 'createhangout',
        'hangout_type': 'onair',
        'initial_apps': [
            { 'app_id' : 'effortless-city-135523',
              'start_data' : 'dQw4w9WgXcQ',
              'app_type' : 'ROOM_APP' }
        ],
        'widget_size': 72
        });
      });

    function instructorChart() {
        var queue = {
            confused: [],
            great: [],
            example: [],
            x: []
        };

        var dataQueue = {
            confused: [],
            great: [],
            example: [],
            x: []
        };

        var dataLength=30;
        var xVal= dataLength;

        function seedData(obj){
            for (var category in obj){
                var tempIndex=0;
                while (obj[category].length<dataLength){
                    obj[category].push({x:tempIndex, y:0});
                    tempIndex++;
                }
            }
        }
        seedData(queue);

        var chartCode = new CanvasJS.Chart("chartCode",{
            creditText: "",
            title :{
                text: "Live Feedback",
                fontColor: "white"
            },
            backgroundColor: null,
            axisX: {
                tickLength: 0,
                valueFormatString: " ",
                lineThickness: 0
            },
            axisY: {
                minimum: -5,
                maximum: 10,
                tickLength: 0,
                gridThickness: 0,
                labelFontColor: 'white',
                lineColor: 'white'
            },
            data: [{
                markerType: 'none',
                color: '#F0AD4E',
                type: "line",
                name: "Confused",
                dataPoints: queue['confused']
            },
            {
                markerType: 'none',
                color: '#5BC0DE',
                type: "line",
                name: "Example",
                dataPoints: queue['example']
            },
            {
                markerType: 'none',
                color: '#5CB85C',
                type: "line",
                name: "Great",
                dataPoints: queue['great']
            },
            {
                markerType: 'none',
                color: 'white',
                type: 'line',
                name: 'x-axis',
                dataPoints: queue['x']
            }
            ]
        });

        var updateChart = function () {
            xVal++;
            queue['confused'].push({x: xVal, y:0+dataQueue['confused'].length});
            queue['example'].push({x: xVal, y:0+dataQueue['example'].length});
            queue['great'].push({x: xVal, y:0+dataQueue['great'].length});
            queue['x'].push({x: xVal, y:0})


            if (queue['confused'].length > dataLength) queue['confused'].shift();
            if (queue['example'].length > dataLength) queue['example'].shift();
            if (queue['great'].length > dataLength) queue['great'].shift();
            if (queue['x'].length > dataLength) queue['x'].shift();

            chartCode.render();
            if (xVal%15 === 0) {
              dataQueue['confused'].shift();
              dataQueue['example'].shift();
              dataQueue['great'].shift();
            }

        };

        function updateInstructorView(){
            setInterval(function(){
                updateChart();
                // socket.emit('signalFeedbackRefresh')
            }, 1000);
        };

        updateInstructorView();

        socket.on('updateChart', function (data) {
          if (data === "Great" || data === "Confused" || data === "Example") {
              data = data.toLowerCase();
              dataQueue[data].push("instance");
          }
        });
    }

});

// app.controller('CreateLecture', function($scope, $uibModal, LectureFactory) {
//
//     $scope.showLectureModal = function() {
//
//         $scope.opts = {
//         backdrop: true,
//         backdropClick: true,
//         transclude: true,
//         dialogFade: false,
//         keyboard: true,
//         templateUrl : 'js/views/instructor/instructorModal.html',
//         controller : LectureInstanceCtrl,
//         resolve: {
//
//           }
//        };
//
//         $scope.opts.resolve.item = function() {
//             return angular.copy({polls:$scope.polls, lecture: $scope.lecture}); // pass name to Dialog
//         }
//
//     if ($(".start").html()=='Begin') {
//         var modalInstance = $uibModal.open($scope.opts);
//     }
//     else {
//         LectureFactory.setEnd().then(function() {
//             $scope.curLecture = undefined;
//             socket.emit('endingLecture');
//             $scope.$evalAsync();
//         })
//         $(".start").html('Begin');
//         $(".start").css('background-color', 'green');
//     }
//
//     };
//
// })

// var LectureInstanceCtrl = function($scope, $uibModalInstance, $uibModal, LectureFactory) {
//
//   $scope.submitLecture = function() {
//
//     LectureFactory.setStart($scope.lectureName,$scope.lectureTeacher).then(function(lecture) {
//         socket.emit('startingLecture', lecture);
//     })
//     .then(function(){
//         $uibModalInstance.close();
//     })
//   };
//
//   $scope.cancel = function () {
//     $uibModalInstance.dismiss('cancel');
//   }
// }
