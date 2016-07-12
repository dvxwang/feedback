
app.controller('InstructorCtrl', function ($scope, $log, $state, LectureFactory, $stateParams, curLecture) {

    //Requests permission for Chrome notifications
    if ("Notification" in window) Notification.requestPermission();

    //Activates page once lecture starts
    function initLecture(updatedLecture) {
        $scope.curLecture = updatedLecture;
        if ($scope.curLecture.startTime) {
            instructorChart();
            $("#startButton").html("Stop");
            $("#startButton").css('background-color', 'red');
        }
    }

    //Starts/ends lecture for all members
    $scope.startLecture = function() {
      if ($("#startButton").html()=='Begin') {
        return LectureFactory.setStart($scope.curLecture);
      } else {
        return LectureFactory.setEnd($scope.curLecture);
      }
    }

    //Back to lectures page
    $scope.goToLecture = function() {
        $state.go('lecture');
    }

    $scope.logOut = function() {
        $state.go('login');
    }

    //Shows active poll

    $scope.nopoll

    //Sets up time series chart
    function instructorChart() {
        
        var dataLength=30; //number of data points in time series
        var xVal= dataLength;

        //Stores data displayed in chart
        var queue = {
            confused: [],
            great: [],
            example: [],
            x: []
        };
        
        //Initializes chart data to all 0's
        (function seedData(obj){
            for (var category in obj){
                var tempIndex=0;
                while (obj[category].length<dataLength){
                    obj[category].push({x:tempIndex, y:0});
                    tempIndex++;
                }
            }
        })(queue);


        //Stores data to be added to data to show in chart
        var dataQueue = {
            confused: [],
            great: [],
            example: [],
            x: []
        };


        var chartCode = new CanvasJS.Chart("chartCode",{
            creditText: "",
            backgroundColor: null,
            axisX: {
                tickLength: 0,
                valueFormatString: " ",
                lineThickness: 0
            },
            axisY: {
                minimum: 0,
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

        //Updates data queue to show in chart
        function updateChart() {
            xVal++;
            for (var feedbackCategory in queue){
                queue[feedbackCategory].push({x: xVal, y:0+dataQueue[feedbackCategory].length});
                if (queue[feedbackCategory].length > dataLength) queue[feedbackCategory].shift();
            }
            chartCode.render();
        }

        (function updateInstructorView(){
            setInterval(function(){
                updateChart();
            }, 1000);
        })();
        
        socket.on('updateChart', function (data) {
          if (data.category === "great" || data.category === "confused" || data.category === "example") {
            data.comment === "adminReset" ? dataQueue[data.category] = [] : dataQueue[data.category].push("instance");
          }
        })
    }

    //Listens for start/end/chart events
    socket.on('startLecture', initLecture);
    socket.on('socketCount', function(socketCount){
        $scope.socketCount = socketCount;
        $scope.$evalAsync();
    });
    socket.emit('socketQuery');
    socket.on('endLecture', function(lecture) {$state.go('lecture'); });

    initLecture(curLecture);
});
