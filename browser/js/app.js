'use strict';

window.app = angular.module('MyApp', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngKookies']);

app.config(function ($urlRouterProvider, $locationProvider, $kookiesProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function () {
        window.location.reload();
    });

    $kookiesProvider.config.json = true;

});

app.config(function ($stateProvider) {
    $stateProvider.state('student', {
        url: '/student',
        templateUrl: 'js/views/student/student.html',
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: 'js/views/instructor/instructor.html',
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('summary', {
        url: '/summary',
        templateUrl: 'js/views/summary/summary.html',
    });
});

app.controller('LoginCtrl', function ($scope, $state) {

	$scope.loginStatus = function(){
		var temp = $scope.login;

		if (temp==='admin'){
			$state.go('admin');
		}
		else if (temp==='student'){
			$state.go('student');
		}
        else if (temp==='summary'){
            $state.go('summary');
        }
	}

});

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
            legend:{
                verticalAlign: "bottom",
                horizontalAlign: "center",
                fontSize: 12,
                cursor:"pointer",
                itemclick : function(e) {
                  if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                  e.dataSeries.visible = false;
                  }
                  else {
                    e.dataSeries.visible = true;
                  }
                  chartQuestion.render();
                }
            },
            data: [{
                markerType: 'none',
                color: 'white',
                type: "line",
                showInLegend: true,
                name: "Confused",
                dataPoints: queue['confused']
            },
            {
                markerType: 'none',
                color: 'red',
                type: "line",
                showInLegend: true,
                name: "Example",
                dataPoints: queue['example']
            },
            {
                markerType: 'none',
                color: 'blue',
                type: "line",
                showInLegend: true,
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
          console.log("App received back: ",data);
          data = data.toLowerCase();
          dataQueue[data].push("instance");
        });

        $('.start').click(function(){
            if ($(this).html()=='Start') {
                console.log("trigger start");
                LectureFactory.setStart();
                $(this).html('Stop');
                $(this).css('background-color', 'red');
            }
            else {
                console.log("trigger stop");
                LectureFactory.setEnd();
                $(this).html('Start');
                $(this).css('background-color', 'green');
            }
        })

    });

});
