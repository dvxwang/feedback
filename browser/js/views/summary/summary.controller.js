app.controller('SummaryCtrl', function($scope, SummaryFactory, LectureFactory, lecture) {

  $scope.lecture = lecture;

  LectureFactory.getById($scope.lecture.id)
  .then((lecture)=> {
    $scope.baseTime = lecture.startTime
  });

  SummaryFactory.returnFeedBackJSON($scope.lecture.id)
  .then((feedback) => {
    $scope.feedback = feedback.map(function(el) {
      return {"time":el.time-$scope.baseTime, "category":el.category}
    });
  });

  function groupyData(feedback) {
    let grouped = {}
    feedback.forEach(function(piece) {

    })
  }

    var spec = {
     "width": 400,
     "height": 200,
     "padding": {"top": 10, "left": 30, "bottom": 30, "right": 10},
     "data": [{"name" : "points"}],
       "scales": [
       {
         "name": "x",
         "nice": true,
         "range": "width",
         "domain": {"data": "points", "field": "data.x"}
       },
       {
         "name": "y",
         "nice": true,
         "range": "height",
         "domain": {"data": "points", "field": "data.y"}
       }
     ],
     "axes": [
       {"type": "x", "scale": "x"},
       {"type": "y", "scale": "y"}
     ],
     "marks": [
       {
         "type": "symbol",
         "from": {"data": "points"},
         "properties": {
           "enter": {
             "x": {"scale": "x", "field": "data.x"},
             "y": {"scale": "y", "field": "data.y"},
             "stroke": {"value": "steelblue"},
             "fillOpacity": {"value": 0.5}
           },
           "update": {
             "fill": {"value": "transparent"},
             "size": {"value": 100}
           },
           "hover": {
             "fill": {"value": "pink"},
             "size": {"value": 300}
           }
         }
       }
     ]
    };
  let data = {"points": $scope.xy}
  vg.parse.spec(spec, function(chart) {
    var view = chart({el:".chart", data:data})  //here is where we populate the empty spec data holder with our calculated data
      .update();
  });

});
