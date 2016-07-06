app.controller('InstructorCtrl', function ($scope, $log, $state, LectureFactory, $stateParams, curLecture) {

    $scope.curLecture = curLecture;

    if ($scope.curLecture.startTime) {
        instructorChart()
        $(".start").html("Stop");
        $(".start").css('background-color', 'red');
    }

    $scope.startLecture = function() {
      if ($(".start").html()=='Begin') {
          return LectureFactory.setStart($scope.curLecture)
      } else {
          return LectureFactory.setEnd($scope.curLecture)
      }
    }

    Notification.requestPermission().then(function(result) {
      console.log(result);
    });

    socket.on('startLecture', function(lecture) {
      instructorChart()
      $(".start").html("Stop");
      $(".start").css('background-color', 'red');
      $scope.$evalAsync();
    })

    socket.on('endLecture', function(lecture) {
      $state.go('lecture')
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

        };

        function updateInstructorView(){
            setInterval(function(){
                updateChart();
                socket.emit('signalFeedbackRefresh');
            }, 1000);
        };

        updateInstructorView();

        socket.on('updateChart', function (data) {
          data.category = data.category.toLowerCase();
          if (data.category === "great" || data.category === "confused" || data.category === "example") {
            if (!data.comment) 
              dataQueue[data.category].push("instance");
            if (data.comment)
              dataQueue[data.category] = [];
          }
        });
    }

});
