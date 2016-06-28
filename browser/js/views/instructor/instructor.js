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

$(document).ready(function() {

    $('.start').click(function(){
        if ($(this).html()=='Start') {
            console.log("trigger start");
            $.post('api/lecture/start',{name: "Demo Lecture", lecturer: "Omri", startTime: Math.floor(Date.now()/1000)});
            $(this).html('Stop');
            $(this).css('background-color', 'red');
        }
        else {
            console.log("trigger stop");
            $.post('api/lecture/end',{id: 1, endTime: Math.floor(Date.now()/1000)});
            $(this).html('Start');
            $(this).css('background-color', 'green');
        }
    })

});