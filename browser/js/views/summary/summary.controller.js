app.controller('SummaryCtrl', function($scope, SummaryFactory, LectureFactory, lecture) {

  $scope.lecture = lecture;

  $scope.clicker = function() {
    console.log($scope.compare)
  }

  LectureFactory.getById($scope.lecture.id)
  .then((lecture)=> {
    $scope.baseTime = lecture.startTime;
  });

  LectureFactory.getInstructorLectures()
  .then((lectures) => {
    $scope.pastLectures = lectures.past;
  })

  SummaryFactory.returnFeedBackJSON($scope.lecture.id)
  .then((feedback) => {
    return feedback.map(function(el) {
      return {"time": el.time-$scope.baseTime, "category":el.category}
    })
  })
  .then((feedback) => {

    $scope.timeSeries = timeSeries(feedback);

    $scope.timeSeriesFormat = {
      example: {"points": $scope.timeSeries.example},
      great: {"points": $scope.timeSeries.great},
      confused: {"points": $scope.timeSeries.confused},
      see: {"points": $scope.timeSeries.see},
      hear: {"points": $scope.timeSeries.hear},
      bbreak: {"points": $scope.timeSeries.break}
    }

    $scope.Series = $scope.timeSeriesFormat.great;

    $scope.example_max = $scope.timeSeries.example[$scope.timeSeries.example.length-1].y;
    $scope.great_max = $scope.timeSeries.great[$scope.timeSeries.great.length-1].y;
    $scope.confused_max = $scope.timeSeries.confused[$scope.timeSeries.confused.length-1].y;
    $scope.see_max = $scope.timeSeries.see[$scope.timeSeries.see.length-1].y;
    $scope.hear_max = $scope.timeSeries.hear[$scope.timeSeries.hear.length-1].y;
    $scope.break_max = $scope.timeSeries.break[$scope.timeSeries.break.length-1].y;

    let table_data = { "table": [
      {"category":"Great", "amount":$scope.great_max},
      {"category":"Confused", "amount":$scope.confused_max},
      {"category":"Example", "amount":$scope.example_max},
      {"category":"See", "amount":$scope.see_max},
      {"category":"Hear", "amount":$scope.hear_max},
      {"category":"Break", "amount":$scope.break_max}
    ]};
    $scope.columns = table_data;
  })

  $scope.compareTimeSeries = function(compare) {
    return SummaryFactory.returnFeedBackJSON(compare)
    .then((feedback) => {
      return feedback.map(function(el) {
        return {"time": el.time-$scope.baseTime, "category":el.category}
      })
    })
    .then((feedback) => {

      $scope.timeSeriesCompare = timeSeries(feedback);
      $scope.timeSeriesFormatCompare = {
        example: {"points": $scope.timeSeriesCompare.example},
        great: {"points": $scope.timeSeriesCompare.great},
        confused: {"points": $scope.timeSeriesCompare.confused},
        see: {"points": $scope.timeSeriesCompare.see},
        hear: {"points": $scope.timeSeriesCompare.hear},
        bbreak: {"points": $scope.timeSeriesCompare.break}
      }

    })

  }

  function timeSeries(feedback) {

    let max = feedback[feedback.length-1].time;

    let grouped = {
      "great" : {},
      "confused": {},
      "example": {},
      "see": {},
      "hear": {},
      "break": {},
      "How would you rate this lecture?": {}
    };

    let timeSeries = {
      "great" : [],
      "confused": [],
      "example": [],
      "see": [],
      "hear":[],
      "break":[],
      "How would you rate this lecture?": []
    };

    feedback.forEach(function(piece) {
      if(!grouped[piece.category][piece.time]) grouped[piece.category][piece.time] = [piece];
      else grouped[piece.category][piece.time].push(piece);
    });

    function countResponse(group, type) {
      let responses = 0;
      let time = 0;
      while (time < max) {
        if (group[type][time]) responses += group[type][time].length;
        timeSeries[type].push({"x":(time/60), "y":responses});
        time ++;
      }
    }

    countResponse(grouped, "great");
    countResponse(grouped, "confused");
    countResponse(grouped, "example");
    countResponse(grouped, "see");
    countResponse(grouped, "hear");
    countResponse(grouped, "break");

    return timeSeries;
  }

  $scope.renderer = 'canvas';
  // "domain": {"data": "points", "field": "x"},
  $scope.line = {
    "width": 800,
    "height": 200,
    "padding": {"top": 10, "left": 30, "bottom": 30, "right": 10},
    "data": [
      {"name": "points"}
    ],
    "scales": [
      {
        "name": "x",
        "type": "linear",
        "range": "width",
        "domain": {"data": "points", "field": "x"}
      },
      {
        "name": "y",
        "range": "height",
        "nice": true,
        "domain": {"data": "points", "field": "y"}
      }
    ],
    "axes": [
      {"type": "x", "scale": "x"},
      {"type": "y", "scale": "y"}
    ],
    "marks": [
      {
        "type": "line",
        "from": {"data": "points"},
        "key": "x",
        "properties": {
          "enter": {
            "x": {"scale": "x", "field": "x"},
            "y": {"scale": "y", "field": "y"},
          },
          "update": {
            "x": {"scale": "x", "field": "x"},
            "y": {"scale": "y", "field": "y"},
            "stroke": {"value": "steelblue"},
            "strokeWidth": {"value": "2"}
          }
        }
      }
    ],
    "responsive": {
      "enabled": true
    }
  };

  $scope.bar = {
    "width": 400,
    "height": 200,
    "padding": {"top": 10, "left": 30, "bottom": 20, "right": 10},

    "data": [
      {
        "name": "table",
        "values": []
      }
    ],

    "signals": [
      {
        "name": "tooltip",
        "init": {},
        "streams": [
          {"type": "rect:mouseover", "expr": "datum"},
          {"type": "rect:mouseout", "expr": "{}"}
        ]
      }
    ],

    "predicates": [
      {
        "name": "tooltip", "type": "==",
        "operands": [{"signal": "tooltip._id"}, {"arg": "id"}]
      }
    ],

    "scales": [
      { "name": "xscale", "type": "ordinal", "range": "width",
        "domain": {"data": "table", "field": "category"} },
      { "name": "yscale", "range": "height", "nice": true,
        "domain": {"data": "table", "field": "amount"} }
    ],

    "axes": [
      { "type": "x", "scale": "xscale" },
      { "type": "y", "scale": "yscale" }
    ],

    "marks": [
      {
        "type": "rect",
        "from": {"data":"table"},
        "properties": {
          "enter": {
            "x": {"scale": "xscale", "field": "category"},
            "width": {"scale": "xscale", "band": true, "offset": -1},
            "y": {"scale": "yscale", "field": "amount"},
            "y2": {"scale": "yscale", "value":0}
          },
          "update": { "fill": {"value": "steelblue"} },
          "hover": { "fill": {"value": "red"} }
        }
      },
      {
        "type": "text",
        "properties": {
          "enter": {
            "align": {"value": "center"},
            "fill": {"value": "#333"}
          },
          "update": {
            "x": {"scale": "xscale", "signal": "tooltip.category"},
            "dx": {"scale": "xscale", "band": true, "mult": 0.5},
            "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -5},
            "text": {"signal": "tooltip.amount"},
            "fillOpacity": {
              "rule": [
                {
                  "predicate": {"name": "tooltip", "id": {"value": null}},
                  "value": 0
                },
                {"value": 1}
              ]
            }
          }
        }
      }
    ]
  }

  // default scale definition
  $scope.line.width = 0.55*window.innerWidth;
  $scope.line.height = 0.25*window.innerHeight;
  $scope.bar.width = 0.25*window.innerWidth;
  $scope.bar.height = 0.25*window.innerHeight;

  // rerender on resize
  function chart_render() {
    $scope.line.width = 0.55*window.innerWidth;
    $scope.line.height = 0.25*window.innerHeight;
    $scope.bar.width = 0.25*window.innerWidth;
    $scope.bar.height = 0.25*window.innerHeight;

    $scope.$digest();
  }

  window.onresize = chart_render;

});
