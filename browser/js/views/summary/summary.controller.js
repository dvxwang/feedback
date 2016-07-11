app.controller('SummaryCtrl', function($scope, SummaryFactory, LectureFactory, lecture) {

  $scope.lecture = lecture;
  $scope.compareLectures = [];
  $scope.color = {};

  $scope.getLecture = LectureFactory.getById;

  $scope.getLecture($scope.lecture.id)
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

    let id = $scope.lecture.id;

    $scope.timeSeriesFormat = {
      example: { "name": "example_"+id, "values": $scope.timeSeries.example },
      great: { "name": "great_"+id, "values": $scope.timeSeries.great },
      confused: { "name": "confused_"+id, "values": $scope.timeSeries.confused },
      see: { "name": "see_"+id, "values": $scope.timeSeries.see },
      hear: { "name": "hear_"+id, "values": $scope.timeSeries.hear },
      bbreak: { "name": "bbreak_"+id, "values": $scope.timeSeries.break }
    }

    $scope.compareLectures.push({"lecureId":$scope.lecture.id, "lectureName":$scope.lecture.name, "data":$scope.timeSeriesFormat});

    $scope.toggleTimeSeries($scope.timeSeriesFormat.confused);

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
  });

  $scope.compareTimeSeries = function(compare) {
    if ($scope.compareLectures.length >2) return
    let baseTime;
    let lectureName;

    return LectureFactory.getById(compare)
    .then((lecture)=> {
      baseTime = lecture.startTime;
      lectureName = lecture.name;
    })
    .then(()=>{
      return SummaryFactory.returnFeedBackJSON(compare)
    })
    .then((feedback) => {
      return feedback.map(function(el) {
        return {"time": el.time-baseTime, "category":el.category}
      })
    })
    .then((feedback) => {

      let timeSeriesCompare = timeSeries(feedback);
      let timeSeriesFormatCompare = {
        example: { "name": "example_"+compare, "values": timeSeriesCompare.example },
        great: { "name": "great_"+compare, "values": timeSeriesCompare.great },
        confused: { "name": "confused_"+compare, "values": timeSeriesCompare.confused },
        see: { "name": "see_"+compare, "values": timeSeriesCompare.see },
        hear: { "name": "hear_"+compare, "values": timeSeriesCompare.hear },
        bbreak: { "name": "bbreak_"+compare, "values": timeSeriesCompare.break }
      }

      $scope.compareLectures.push({"lectureId": compare, "lectureName":lectureName, "data":timeSeriesFormatCompare});
    });
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
        timeSeries[type].push({"x":(time/60), "y":responses, "type":type});
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

  $scope.removeLecture = function(lecture) {
    $scope.compareLectures.splice($scope.compareLectures.map(function(lecture) {
      return lecture.lectureId;
    }).indexOf(lecture.id),1);
  }

  $scope.toggleTimeSeries = function(data) {

    let color = Math.floor(1000*Math.random());
    if (!$scope.color[data.name]) $scope.color[data.name] = color;
    else $scope.color[data.name] = null;

    let markObj = {
      "type": "line",
      "from": {"data": data.name},
      "key": "x",
      "properties": {
        "enter": {
          "x": {"scale": "x", "field": "x"},
          "y": {"scale": "y", "field": "y"},
          "text": {"field":"name"}
        },
        "update": {
          "x": {"scale": "x", "field": "x"},
          "y": {"scale": "y", "field": "y"},
          "text": {"field":"name"},
          "stroke": {"value":"#"+color},
          "strokeWidth": {"value": "2"}
        }
      }
    }

    let scaleObj = {
      "name": "type",
      "type": "ordinal",
      "domain": {"data": data.name, "field": "type"},
      "range": ["#"+color]
    }

    if (checkSpec($scope.line.data, data)) {
      $scope.line.data.push(data);
      $scope.line.marks.push(markObj);
      $scope.line.scales.push(scaleObj);
      setScale(data);
    } else {
      spliceData($scope.line.data, data);
      spliceScale($scope.line.scales, data);
      setScale(data);
    }

    function checkSpec(data, input) {
      return data.map(function(datum) { return datum.name; } ).indexOf(input.name) === -1;
    }

    function spliceData(data, input) {
      data.splice(data.map(function(datum) { return datum.name; } ).indexOf(input.name), 1)
    }

    function spliceScale(scales, input) {
      let i = 0;
      while(i<scales.length) {
        if (scales[i].domain.data===input.name) scales.splice(i,1);
        else i++;
      }
    }

    function setScale(input) {
      let max_x = 0;
      let max_y = 0;
      let index;
      // sets x & y scale to the maximum domain & range of data on graph
      $scope.line.data.forEach(function(type, i) {
        if (type.values[type.values.length-1].y > max_y || type.values.length > max_x) {
          max_x = type.values.length;
          max_y = type.values[type.values.length-1].y;
          index = i;
        }
      });
      $scope.line.scales.push({
        "name": "x",
        "type": "linear",
        "range": "width",
        "domain": {"data": $scope.line.data[index].name, "field": "x"}
      });
      $scope.line.scales.push({
        "name": "y",
        "range": "height",
        "nice": true,
        "domain": {"data": $scope.line.data[index].name, "field": "y"}
      });
    }

  }

  $scope.renderer = 'canvas';

  $scope.line = {
    "width": 800,
    "height": 200,
    "padding": {"top": 20, "left": 50, "bottom": 50, "right": 50},
    "data": [
      {
        "name": "points",
       "values": [{"x":0, "y":0, "type":"temp"}]
       }
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
      },
      {
        "name": "type",
        "type": "ordinal",
        "domain": {"data": "points", "field": "type"},
        "range": ["#800"]
      },
      {
        "name": "legend_labels",
        "type": "ordinal",
        "domain": ["example", "confused", "great"],
        "range": ["#800", "#800", "#800"]
      }
    ],
    "axes": [
      {"type": "x", "scale": "x", "title":"Time (mins)"},
      {"type": "y", "scale": "y", "title":"Count"}
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
            "stroke": {"value": "green"},
            "strokeWidth": {"value": "2"}
          }
        }
      }
    ]
  };

  $scope.bar = {
    "width": 400,
    "height": 200,
    "padding": {"top": 20, "left": 30, "bottom": 20, "right": 10},

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
