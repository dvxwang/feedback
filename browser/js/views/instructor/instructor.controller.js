app.controller('InstructorCtrl', function ($scope, $state, LectureFactory) {

    $(document).ready(function() {
        
        gapi.hangout.render('startButton2', {
        'render': 'createhangout',
        'hangout_type': 'onair',
        'initial_apps': [
            { app_id : 'effortless-city-135523', start_data : 'dQw4w9WgXcQ', 'app_type' : 'ROOM_APP' }
        ],
        'widget_size': 72
        });

        var queue = {
            confused: [],
            great: [],
            example: []
        };

        var dataQueue = {
            confused: [],
            great: [],
            example: []
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
                color: 'orange',
                type: "line",
                name: "Confused",
                dataPoints: queue['confused']
            },
            {
                markerType: 'none',
                color: 'blue',
                type: "line",
                name: "Example",
                dataPoints: queue['example']
            },
            {
                markerType: 'none',
                color: 'green',
                type: "line",
                name: "Great",
                dataPoints: queue['great']
            }
            ]
        });

        var updateChart = function () {    
            xVal++;
            
            queue['confused'].push({x: xVal, y:0+dataQueue['confused'].length});
            queue['example'].push({x: xVal, y:0+dataQueue['example'].length});
            queue['great'].push({x: xVal, y:0+dataQueue['great'].length});

            if (queue['confused'].length > dataLength) queue['confused'].shift();                
            if (queue['example'].length > dataLength) queue['example'].shift();  
            if (queue['great'].length > dataLength) queue['great'].shift();                

            chartCode.render();  

            dataQueue['confused']=[];
            dataQueue['example']=[];
            dataQueue['great']=[];

        };

        function updateInstructorView(){
            setInterval(function(){
                updateChart();
            }, 1000); 
        };

        updateInstructorView();

        socket.on('updateFeedback', function (data) {
          data = data.toLowerCase();
          dataQueue[data].push("instance");
        });

        $('.start').click(function(){
            if ($(this).html()=='Begin') {
                LectureFactory.setStart().then(function(lecture) {
                    $scope.curLecture = lecture;
                    socket.emit('startingLecture', lecture)
                })
                $(this).html('Stop');
                $(this).css('background-color', 'red');
            }
            else {
                LectureFactory.setEnd().then(function() {
                    $scope.curLecture = undefined;
                    socket.emit('endingLecture')
                })
                $(this).html('Begin');
                $(this).css('background-color', 'green');
            }
        })

    });

});