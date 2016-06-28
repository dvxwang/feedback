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
    templateUrl: 'js/views/student/student.html'
  });
});

app.config(function ($stateProvider) {
  $stateProvider.state('admin', {
    url: '/admin',
    templateUrl: 'js/views/instructor/instructor.html'
  });
});

app.config(function ($stateProvider) {
  $stateProvider.state('summary', {
    url: '/summary',
    templateUrl: 'js/views/summary/summary.html'
  });
});

app.controller('LoginCtrl', function ($scope, $state) {

  console.log("reached login ctrl");
  $scope.loginStatus = function () {
    console.log("reached login status");
    var temp = $scope.login;
    console.log("temp: ", temp);

    if (temp === 'admin') {
      $state.go('admin');
    } else if (temp === 'student') {
      $state.go('student');
    } else if (temp === 'summary') {
      $state.go('summary');
    }
  };
});

var socket = io(window.location.origin);
app.controller('CreatePoll', function ($scope, $uibModal) {

  $scope.showModal = function () {

    $scope.opts = {
      backdrop: true,
      backdropClick: true,
      transclude: true,
      dialogFade: false,
      keyboard: true,
      templateUrl: 'js/common/createPollModal/createPollModal.html',
      controller: ModalInstanceCtrl,
      resolve: {} // empty storage
    };

    $scope.opts.resolve.item = function () {
      return angular.copy({ polls: $scope.polls }); // pass name to Dialog
    };

    var modalInstance = $uibModal.open($scope.opts);

    modalInstance.result.then(function () {
      //on ok button press
    }, function () {
      //on cancel button press
    });
  };
});

var ModalInstanceCtrl = function ModalInstanceCtrl($scope, $uibModalInstance, $uibModal, item, PollFactory) {

  $scope.item = item;

  $scope.customOptions = function (option) {
    $scope.customShow = option === 'custom';
  };

  $scope.submitPoll = function () {
    var poll = {};
    poll.question = $scope.newPoll;
    poll.lectureId = 1;
    if ($scope.option == 'custom') poll.options = [$scope.a, $scope.b, $scope.c, $scope.d];

    PollFactory.createPoll(poll).then(function () {
      return PollFactory.getAllByLectureId(1);
    }).then(function (polls) {
      $scope.polls = polls;
    }).then(function () {
      $uibModalInstance.close();
    });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};

app.directive('feedback', function ($state, FeedbackFactory) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/feedback/feedback.html',
    link: function link(scope) {
      scope.addMessage = false;
      scope.rejectMessage = false;

      scope.countFeedback = function (category) {
        if (category === 'Great' && !scope.greatClicked || category === 'Confused' && !scope.confusedClicked || category === 'Example' && !scope.exampleClicked || category === 'Cannot See' && !scope.seeClicked || category === 'Cannot Hear' && !scope.hearClicked || category === 'Request Break' && !scope.breakClicked) {
          return FeedbackFactory.addFeedback(category).then(function () {
            return FeedbackFactory.countFeedback(category);
          }).then(function (result) {
            socket.emit('submittedFeedback', category);

            console.log('IT IS HERE', result);
            if (category === 'Great') {
              scope.greatCount = result;
              scope.greatClicked = true;
            }
            if (category === 'Confused') {
              scope.confusedCount = result;
              scope.confusedClicked = true;
            }
            if (category === 'Example') {
              scope.exampleCount = result;
              scope.exampleClicked = true;
            }
            if (category === 'Cannot See') {
              scope.seeCount = result;
              scope.seeClicked = true;
            }
            if (category === 'Cannot Hear') {
              scope.hearCount = result;
              scope.hearClicked = true;
            }
            if (category === 'Request Break') {
              scope.breakCount = result;
              scope.breakClicked = true;
            }
          }).then(function () {
            scope.addMessage = true;
            setTimeout(function () {
              scope.addMessage = false;
              scope.$digest();
            }, 1500);
          });
        } else {
          scope.rejectMessage = true;
          setTimeout(function () {
            scope.rejectMessage = false;
            scope.$digest();
          }, 1500);
        }
      };

      setInterval(function () {
        scope.greatCount = null;
        scope.greatClicked = null;
        scope.confusedCount = null;
        scope.confusedClicked = null;
        scope.exampleCount = null;
        scope.exampleClicked = null;
        scope.seeCount = null;
        scope.seeClicked = null;
        scope.hearCount = null;
        scope.hearClicked = null;
        scope.breakCount = null;
        scope.breakClicked = null;
        scope.$digest();
      }, 30 * 1000);

      socket.on('updateFeedback', function (category) {
        console.log('received -->', category);

        return FeedbackFactory.countFeedback(category).then(function (result) {
          if (category === 'Great') {
            scope.greatCount = result;
          }
          if (category === 'Confused') {
            scope.confusedCount = result;
          }
          if (category === 'Example') {
            scope.exampleCount = result;
          }
          if (category === 'Cannot See') {
            scope.seeCount = result;
          }
          if (category === 'Cannot Hear') {
            scope.hearCount = result;
          }
          if (category === 'Request Break') {
            scope.breakCount = result;
          }
        });
        // scope.$digest()
      });
    }
  };
});

app.factory('FeedbackFactory', function ($http) {
  var FeedbackFactory = {};

  FeedbackFactory.addFeedback = function (category) {
    return $http.post('/api/feedback/', { category: category }).then(function (result) {
      console.log('gotHERE', result);
    });
  };

  FeedbackFactory.countFeedback = function (category) {
    return $http.get('/api/feedback/count/' + category).then(function (result) {
      return result.data;
    });
  };

  return FeedbackFactory;
});
app.directive('poll', function ($state, PollFactory) {
  return {
    restrict: 'E',
    scope: {
      useCtrl: "@"
    },
    templateUrl: 'js/common/poll/poll.html',
    link: function link(scope) {

      scope.delete = PollFactory.deletePoll;

      PollFactory.getAllByLectureId(1).then(function (currentPolls) {
        scope.polls = currentPolls;
      });

      scope.sendPoll = function (poll) {
        socket.emit('pollOut', poll);
      };
    }
  };
});

app.factory('PollFactory', function ($http) {
  function dotData(dot) {
    return dot.data;
  }
  var cachedPolls = [];
  return {
    getAllByLectureId: function getAllByLectureId(id) {
      return $http.get('/api/poll/lecture/' + id).then(dotData).then(function (polls) {
        angular.copy(polls, cachedPolls);
        return cachedPolls;
      });
    },
    getOneByPollId: function getOneByPollId(id) {
      return $http.get('/api/poll/' + id).then(dotData);
    },
    createPoll: function createPoll(pollObj) {
      return $http.post('/api/poll/', pollObj).then(dotData);
    },
    updatePoll: function updatePoll(pollObj, id) {
      return $http.put('/api/poll/' + id, pollObj).then(dotData);
    },
    deletePoll: function deletePoll(id) {
      return $http.delete('/api/poll/' + id).then(dotData).then(function (removedPoll) {
        cachedPolls.splice(cachedPolls.map(function (item) {
          return item.id;
        }).indexOf(id), 1);
        return cachedPolls;
      });
    }
  };
});

app.directive('question', function ($state, QuestionFactory) {

  return {
    restrict: 'E',
    scope: {
      isAdmin: "@"
    },
    templateUrl: 'js/common/question/question.html',
    link: function link(scope) {

      QuestionFactory.getAllByLectureId(1).then(function (questions) {
        scope.questions = questions.filter(function (q) {
          return q.status === 'open';
        });
      });

      function findIndex(question) {
        for (var i = 0; i < scope.questions.length; i++) {
          if (scope.questions[i].text === question.text) {
            return i;
          }
        }
        return -1;
      }

      function move(question, n) {
        var index = findIndex(question);
        if (index + n > -1 && index + n < scope.questions.length) {
          scope.questions.splice(index, 1);
          scope.questions.splice(index + n, 0, question);
        }
      }

      scope.submit = function () {
        if (scope.newQuestion) {
          var question = { text: scope.newQuestion, submitTime: Date.now(), upvotes: 0 };
          return QuestionFactory.store(question).then(function (q) {
            socket.emit('addingQuestion', q);
            scope.newQuestion = null;
          });
        }
      };

      scope.delete = function (question) {
        socket.emit('deletingQuestion', question);
        return QuestionFactory.delete(question);
      };

      scope.close = function (question) {
        question.status = 'closed';
        return QuestionFactory.update(question).then(function () {
          socket.emit('deletingQuestion', question);
        });
      };

      scope.move = function (question, n) {
        socket.emit('move', question, n);
      };

      scope.upvote = function (question) {
        console.log("scope: ", scope);
        question.hasUpvoted = !question.hasUpvoted;
        question.upvotes++;
        socket.emit('upvoting', question);
        return QuestionFactory.update(question);
      };

      scope.downvote = function (question) {
        question.hasUpvoted = !question.hasUpvoted;
        question.upvotes--;
        socket.emit('downvoting', question);
        return QuestionFactory.update(question);
      };

      socket.on('addQuestion', function (question) {
        scope.questions.unshift(question);
        scope.$evalAsync();
      });

      socket.on('deleteQuestion', function (question) {
        var index = findIndex(question);
        scope.questions.splice(index, 1);
        scope.$evalAsync();
      });

      socket.on('receivedUpvote', function (question) {
        var index = findIndex(question);
        var question = scope.questions[index];
        question.upvotes++;
        scope.$evalAsync();
      });

      socket.on('receivedDownvote', function (question) {
        var index = findIndex(question);
        var question = scope.questions[index];
        question.upvotes--;
        scope.$evalAsync();
      });

      socket.on('moving', function (question, n) {
        move(question, n);
        scope.$evalAsync();
      });
    }
  };
});

app.factory('QuestionFactory', function ($http) {

  var obj = {};

  obj.getAllByLectureId = function (lectureId) {
    return $http.get('/api/question/lecture/' + lectureId).then(function (res) {
      return res.data;
    });
  };

  obj.store = function (question) {
    return $http.post('/api/question', question).then(function (res) {
      return res.data;
    });
  };

  obj.update = function (question) {
    return $http.put('/api/question/' + question.id, question).then(function (res) {
      return res.data;
    });
  };

  obj.delete = function (question) {
    return $http.delete('/api/question/' + question.id).then(function (res) {
      return res.data;
    });
  };

  return obj;
});

app.controller('StudentPoll', function ($scope, $uibModal) {
  $scope.showModal = function () {

    $scope.opts = {
      backdrop: true,
      backdropClick: true,
      transclude: true,
      dialogFade: false,
      keyboard: true,
      templateUrl: 'js/common/studentModal/studentPoll.html',
      controller: StudentModalInstance,
      resolve: {} // empty storage
    };

    $scope.opts.resolve.item = function () {
      return angular.copy({ poll: $scope.poll }); // pass name to Dialog
    };

    var modalInstance = $uibModal.open($scope.opts);

    modalInstance.result.then(function () {
      //on ok button press
    }, function () {
      //on cancel button press
    });
  };

  socket.on('toStudent', function (pollQuestion) {
    $scope.poll = pollQuestion;
    $scope.showModal();
  });
});

function StudentModalInstance($scope, $uibModalInstance, $uibModal, item, PollFactory) {

  $scope.item = item;

  socket.on('toStudent', function (pollQuestion) {
    $scope.poll = pollQuestion;
  });

  $scope.submitAnswer = function () {
    $uibModalInstance.close();
  };
}

gapi.hangout.render('startButton2', {
  'render': 'createhangout',
  'hangout_type': 'onair',
  'initial_apps': [{ app_id: 'effortless-city-135523', start_data: 'dQw4w9WgXcQ', 'app_type': 'ROOM_APP' }],
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

var dataLength = 30;
var xVal = dataLength;

function seedData(obj) {
  for (var category in obj) {
    var tempIndex = 0;
    while (obj[category].length < dataLength) {
      obj[category].push({ x: tempIndex, y: 0 });
      tempIndex++;
    }
  }
}
seedData(queue);

var chartCode = new CanvasJS.Chart("chartCode", {
  creditText: "",
  title: {
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
  legend: {
    verticalAlign: "bottom",
    horizontalAlign: "center",
    fontSize: 12,
    cursor: "pointer",
    itemclick: function itemclick(e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
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
  }, {
    markerType: 'none',
    color: 'red',
    type: "line",
    showInLegend: true,
    name: "Example",
    dataPoints: queue['example']
  }, {
    markerType: 'none',
    color: 'blue',
    type: "line",
    showInLegend: true,
    name: "Great",
    dataPoints: queue['great']
  }]
});

var updateChart = function updateChart() {
  xVal++;

  queue['confused'].push({ x: xVal, y: 0 + dataQueue['confused'].length });
  queue['example'].push({ x: xVal, y: 0 + dataQueue['example'].length });
  queue['great'].push({ x: xVal, y: 0 + dataQueue['great'].length });

  if (queue['confused'].length > dataLength) queue['confused'].shift();
  if (queue['example'].length > dataLength) queue['example'].shift();
  if (queue['great'].length > dataLength) queue['great'].shift();

  chartCode.render();

  dataQueue['confused'] = [];
  dataQueue['example'] = [];
  dataQueue['great'] = [];
};

function updateInstructorView() {
  setInterval(function () {
    updateChart();
  }, 1000);
};

updateInstructorView();

socket.on('updateFeedback', function (data) {
  console.log("App received back: ", data);
  data = data.toLowerCase();
  dataQueue[data].push("instance");
});

$(document).ready(function () {

  $('.start').click(function () {
    if ($(this).html() == 'Start') {
      console.log("trigger start");
      $.post('api/lecture/start', { name: "Demo Lecture", lecturer: "Omri", startTime: Math.floor(Date.now() / 1000) });
      $(this).html('Stop');
      $(this).css('background-color', 'red');
    } else {
      console.log("trigger stop");
      $.post('api/lecture/end', { id: 1, endTime: Math.floor(Date.now() / 1000) });
      $(this).html('Start');
      $(this).css('background-color', 'green');
    }
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInNvY2tldC5qcyIsImNvbW1vbi9jcmVhdGVQb2xsTW9kYWwvY3JlYXRlUG9sbC5jb250cm9sbGVyLmpzIiwiY29tbW9uL2ZlZWRiYWNrL2ZlZWRiYWNrLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9mZWVkYmFjay9mZWVkYmFjay5mYWN0b3J5LmpzIiwiY29tbW9uL3BvbGwvcG9sbC5kaXJlY3RpdmUuanMiLCJjb21tb24vcG9sbC9wb2xsLmZhY3RvcnkuanMiLCJjb21tb24vcXVlc3Rpb24vcXVlc3Rpb24uZGlyZWN0aXZlLmpzIiwiY29tbW9uL3F1ZXN0aW9uL3F1ZXN0aW9uLmZhY3RvcnkuanMiLCJjb21tb24vc3R1ZGVudE1vZGFsL3N0dWRlbnRQb2xsLmNvbnRyb2xsZXIuanMiLCJ2aWV3cy9pbnN0cnVjdG9yL2luc3RydWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsT0FBQSxHQUFBLEdBQUEsUUFBQSxNQUFBLENBQUEsT0FBQSxFQUFBLENBQUEsV0FBQSxFQUFBLGNBQUEsRUFBQSxXQUFBLEVBQUEsV0FBQSxDQUFBLENBQUE7O0FBRUEsSUFBQSxNQUFBLENBQUEsVUFBQSxrQkFBQSxFQUFBLGlCQUFBLEVBQUEsZ0JBQUEsRUFBQTs7QUFFQSxvQkFBQSxTQUFBLENBQUEsSUFBQTs7QUFFQSxxQkFBQSxTQUFBLENBQUEsR0FBQTs7QUFFQSxxQkFBQSxJQUFBLENBQUEsaUJBQUEsRUFBQSxZQUFBO0FBQ0EsV0FBQSxRQUFBLENBQUEsTUFBQTtBQUNBLEdBRkE7O0FBSUEsbUJBQUEsTUFBQSxDQUFBLElBQUEsR0FBQSxJQUFBO0FBRUEsQ0FaQTs7QUFjQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGlCQUFBLEtBQUEsQ0FBQSxTQUFBLEVBQUE7QUFDQSxTQUFBLFVBREE7QUFFQSxpQkFBQTtBQUZBLEdBQUE7QUFJQSxDQUxBOztBQU9BLElBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFB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QUdBLENBdkJBOztBQzlCQSxJQUFBLFNBQUEsQ0FBQSxVQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsZUFBQSxFQUFBO0FBQ0EsU0FBQTtBQUNBLGNBQUEsR0FEQTtBQUVBLFdBQUEsRUFGQTtBQUtBLGlCQUFBLGtDQUxBO0FBTUEsVUFBQSxjQUFBLEtBQUEsRUFBQTtBQUNBLFlBQUEsVUFBQSxHQUFBLEtBQUE7QUFDQSxZQUFBLGFBQUEsR0FBQSxLQUFBOztBQUVBLFlBQUEsYUFBQSxHQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsWUFBQSxhQUFBLE9BQUEsSUFBQSxDQUFBLE1BQUEsWUFBQSxJQUFBLGFBQUEsVUFBQSxJQUFBLENBQUEsTUFBQSxlQUFBLElBQUEsYUFBQSxTQUFBLElBQUEsQ0FBQSxNQUFBLGNBQUEsSUFBQSxhQUFBLFlBQUEsSUFBQSxDQUFBLE1BQUEsVUFBQSxJQUFBLGFBQUEsYUFBQSxJQUFBLENBQUEsTUFBQSxXQUFBLElBQUEsYUFBQSxlQUFBLElBQUEsQ0FBQSxNQUFBLFlBQUEsRUFBQTtBQUNBLGlCQUFBLGdCQUFBLFdBQUEsQ0FBQSxRQUFBLEVBQ0EsSUFEQSxDQUNBLFlBQUE7QUFDQSxtQkFBQSxnQkFBQSxhQUFBLENBQUEsUUFBQSxDQUFBO0FBQ0EsV0FIQSxFQUlBLElBSkEsQ0FJQSxVQUFBLE1BQUEsRUFBQTtBQUNBLG1CQUFBLElBQUEsQ0FBQSxtQkFBQSxFQUFBLFFBQUE7O0FBRUEsb0JBQUEsR0FBQSxDQUFBLFlBQUEsRUFBQSxNQUFBO0FBQ0EsZ0JBQUEsYUFBQSxPQUFBLEVBQUE7QUFDQSxvQkFBQSxVQUFBLEdBQUEsTUFBQTtBQUNBLG9CQUFBLFlBQUEsR0FBQSxJQUFBO0FBQ0E7QUFDQSxnQkFBQSxhQUFBLFVBQUEsRUFBQTtBQUNBLG9CQUFBLGFBQUEsR0FBQSxNQUFBO0FBQ0Esb0JBQUEsZUFBQSxHQUFBLElBQUE7QUFDQTtBQUNBLGdCQUFBLGFBQUEsU0FBQSxFQUFBO0FBQ0Esb0JBQUEsWUFBQSxHQUFBLE1BQUE7QUFDQSxvQkFBQSxjQUFBLEdBQUEsSUFB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QUE7QUFDQSxjQUFBLE1BQUEsU0FBQSxDQUFBLENBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxJQUFBLEVBQUE7QUFDQSxtQkFBQSxDQUFBO0FBQ0E7QUFDQTtBQUNBLGVBQUEsQ0FBQSxDQUFBO0FBQ0E7O0FBRUEsZUFBQSxJQUFBLENBQUEsUUFBQSxFQUFBLENBQUEsRUFBQTtBQUNBLFlBQUEsUUFBQSxVQUFBLFFBQUEsQ0FBQTtBQUNBLFlBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsUUFBQSxDQUFBLEdBQUEsTUFBQSxTQUFBLENBQUEsTUFBQSxFQUFBO0FBQ0EsZ0JBQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxLQUFBLEVBQUEsQ0FBQTtBQUNBLGdCQUFBLFNBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLFFBQUE7QUFDQTtBQUNBOztBQUVBLFlBQUEsTUFBQSxHQUFBLFlBQUE7QUFDQSxZQUFBLE1BQUEsV0FBQSxFQUFBO0FBQ0EsY0FBQSxXQUFBLEVBQUEsTUFBQSxNQUFBLFdBQUEsRUFBQSxZQUFBLEtBQUEsR0FBQSxFQUFBLEVBQUEsU0FBQSxDQUFBLEVBQUE7QUFDQSxpQkFBQSxnQkFBQSxLQUFBLENBQUEsUUFBQSxFQUFBLElBQUEsQ0FBQSxVQUFBLENBQUEsRUFBQTtBQUNBLG1CQUFBLElBQUEsQ0FBQSxnQkFBQSxFQUFBLENBQUE7QUFDQSxrQkFBQSxXQUFBLEdBQUEsSUFBQTtBQUNBLFdBSEEsQ0FBQTtBQUlBO0FBQ0EsT0FSQTs7QUFVQSxZQUFBLE1BQUEsR0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLGVBQUEsSUFBQSxDQUFBLGtCQUFBLEVBQUEsUUFBQTtBQUNBLGVBQUEsZ0JBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQTtBQUNBLE9BSEE7O0FBS0EsWUFBQSxLQUFBLEdBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxpQkFBQSxNQUFBLEdBQUEsUUFBQTtBQUNBLGVBQUEsZ0JBQUEsTUFBQSxDQUFBLFFBQUEsRUFBQSxJQUFBLENBQUEsWUFBQTtB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LE1BQUEsRUFBQTtBQUNBLFFBQUEsT0FBQSxFQUFBLElBQUEsQ0FBQSxFQUFBLEdBQUEsSUFBQSxFQUFBLEdBQUEsSUFBQSxVQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUE7O0FBRUEsTUFBQSxNQUFBLFVBQUEsRUFBQSxNQUFBLEdBQUEsVUFBQSxFQUFBLE1BQUEsVUFBQSxFQUFBLEtBQUE7QUFDQSxNQUFBLE1BQUEsU0FBQSxFQUFBLE1BQUEsR0FBQSxVQUFBLEVBQUEsTUFBQSxTQUFBLEVBQUEsS0FBQTtBQUNBLE1BQUEsTUFBQSxPQUFBLEVBQUEsTUFBQSxHQUFBLFVBQUEsRUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBOztBQUVBLFlBQUEsTUFBQTs7QUFFQSxZQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsWUFBQSxTQUFBLElBQUEsRUFBQTtBQUNBLFlBQUEsT0FBQSxJQUFBLEVBQUE7QUFFQSxDQWpCQTs7QUFtQkEsU0FBQSxvQkFBQSxHQUFBO0FBQ0EsY0FBQSxZQUFBO0FBQ0E7QUFDQSxHQUZBLEVBRUEsSUFGQTtBQUdBOztBQUVBOztBQUVBLE9BQUEsRUFBQSxDQUFBLGdCQUFBLEVBQUEsVUFBQSxJQUFBLEVBQUE7QUFDQSxVQUFBLEdBQUEsQ0FBQSxxQkFBQSxFQUFBLElBQUE7QUFDQSxTQUFBLEtBQUEsV0FBQSxFQUFBO0FBQ0EsWUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFVBQUE7QUFDQSxDQUpBOztBQU1BLEVBQUEsUUFBQSxFQUFBLEtBQUEsQ0FBQSxZQUFBOztBQUVBLElBQUEsUUFBQSxFQUFBLEtBQUEsQ0FBQSxZQUFBO0FBQ0EsUUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLE1BQUEsT0FBQSxFQUFBO0FBQ0EsY0FBQSxHQUFBLENBQUEsZUFBQTtBQUNBLFFBQUEsSUFBQSxDQUFBLG1CQUFBLEVBQUEsRUFBQSxNQUFBLGNBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxXQUFBLEtBQUEsS0FBQSxDQUFBLEtBQUEsR0FBQSxLQUFBLElBQUEsQ0FBQSxFQUFBO0FBQ0EsUUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE1BQUE7QUFDQSxRQUFBLElBQUEsRUFBQSxHQUFBLENBQUEsa0JBQUEsRUFBQSxLQUFBO0FBQ0EsS0FMQSxNQU1BO0FBQ0EsY0FBQSxHQUFBLENBQUEsY0FBQTtBQUNBLFFBQUEsSUFBQSxDQUFBLGlCQUFBLEVBQUEsRUFBQSxJQUFBLENBQUEsRUFBQSxTQUFBLEtBQUEsS0FBQSxDQUFBLEtBQUEsR0FBQSxLQUFBLElBQUEsQ0FBQSxFQUFBO0FBQ0EsUUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLE9BQUE7QUFDQSxRQUFBLElBQUEsRUFBQSxHQUFBLENBQUEsa0JBQUEsRUFBQSxPQUFBO0FBQ0E7QUFDQSxHQWJBO0FBZUEsQ0FqQkEiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0Jztcblxud2luZG93LmFwcCA9IGFuZ3VsYXIubW9kdWxlKCdNeUFwcCcsIFsndWkucm91dGVyJywgJ3VpLmJvb3RzdHJhcCcsICduZ0FuaW1hdGUnLCAnbmdLb29raWVzJ10pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAka29va2llc1Byb3ZpZGVyKSB7XG4gICAgLy8gVGhpcyB0dXJucyBvZmYgaGFzaGJhbmcgdXJscyAoLyNhYm91dCkgYW5kIGNoYW5nZXMgaXQgdG8gc29tZXRoaW5nIG5vcm1hbCAoL2Fib3V0KVxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAvLyBJZiB3ZSBnbyB0byBhIFVSTCB0aGF0IHVpLXJvdXRlciBkb2Vzbid0IGhhdmUgcmVnaXN0ZXJlZCwgZ28gdG8gdGhlIFwiL1wiIHVybC5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG4gICAgLy8gVHJpZ2dlciBwYWdlIHJlZnJlc2ggd2hlbiBhY2Nlc3NpbmcgYW4gT0F1dGggcm91dGVcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignL2F1dGgvOnByb3ZpZGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG5cbiAgICAka29va2llc1Byb3ZpZGVyLmNvbmZpZy5qc29uID0gdHJ1ZTtcblxufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3N0dWRlbnQnLCB7XG4gICAgICAgIHVybDogJy9zdHVkZW50JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy92aWV3cy9zdHVkZW50L3N0dWRlbnQuaHRtbCcsXG4gICAgfSk7XG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWRtaW4nLCB7XG4gICAgICAgIHVybDogJy9hZG1pbicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdmlld3MvaW5zdHJ1Y3Rvci9pbnN0cnVjdG9yLmh0bWwnLFxuICAgIH0pO1xufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3N1bW1hcnknLCB7XG4gICAgICAgIHVybDogJy9zdW1tYXJ5JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy92aWV3cy9zdW1tYXJ5L3N1bW1hcnkuaHRtbCcsXG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSkge1xuXG5cdGNvbnNvbGUubG9nKFwicmVhY2hlZCBsb2dpbiBjdHJsXCIpO1xuXHQkc2NvcGUubG9naW5TdGF0dXMgPSBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKFwicmVhY2hlZCBsb2dpbiBzdGF0dXNcIik7XG5cdFx0dmFyIHRlbXAgPSAkc2NvcGUubG9naW47XG5cdFx0Y29uc29sZS5sb2coXCJ0ZW1wOiBcIix0ZW1wKTtcblxuXHRcdGlmICh0ZW1wPT09J2FkbWluJyl7XG5cdFx0XHQkc3RhdGUuZ28oJ2FkbWluJyk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHRlbXA9PT0nc3R1ZGVudCcpe1xuXHRcdFx0JHN0YXRlLmdvKCdzdHVkZW50Jyk7XG5cdFx0fVxuICAgICAgICBlbHNlIGlmICh0ZW1wPT09J3N1bW1hcnknKXtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnc3VtbWFyeScpO1xuICAgICAgICB9XG5cdH1cblxufSk7XG4iLCJ2YXIgc29ja2V0ID0gaW8od2luZG93LmxvY2F0aW9uLm9yaWdpbik7IiwiYXBwLmNvbnRyb2xsZXIoJ0NyZWF0ZVBvbGwnLCBmdW5jdGlvbigkc2NvcGUsICR1aWJNb2RhbCkge1xuXG4gICRzY29wZS5zaG93TW9kYWwgPSBmdW5jdGlvbigpIHtcblxuICAgICRzY29wZS5vcHRzID0ge1xuICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgIGJhY2tkcm9wQ2xpY2s6IHRydWUsXG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICBkaWFsb2dGYWRlOiBmYWxzZSxcbiAgICBrZXlib2FyZDogdHJ1ZSxcbiAgICB0ZW1wbGF0ZVVybCA6ICdqcy9jb21tb24vY3JlYXRlUG9sbE1vZGFsL2NyZWF0ZVBvbGxNb2RhbC5odG1sJyxcbiAgICBjb250cm9sbGVyIDogTW9kYWxJbnN0YW5jZUN0cmwsXG4gICAgcmVzb2x2ZToge30gLy8gZW1wdHkgc3RvcmFnZVxuICAgICAgfTtcblxuICAgICRzY29wZS5vcHRzLnJlc29sdmUuaXRlbSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYW5ndWxhci5jb3B5KHtwb2xsczokc2NvcGUucG9sbHN9KTsgLy8gcGFzcyBuYW1lIHRvIERpYWxvZ1xuICAgIH1cblxuICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbigkc2NvcGUub3B0cyk7XG5cbiAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgLy9vbiBvayBidXR0b24gcHJlc3NcbiAgICAgIH0sZnVuY3Rpb24oKXtcbiAgICAgICAgLy9vbiBjYW5jZWwgYnV0dG9uIHByZXNzXG4gICAgICB9KVxuICB9XG5cbn0pXG5cbnZhciBNb2RhbEluc3RhbmNlQ3RybCA9IGZ1bmN0aW9uKCRzY29wZSwgJHVpYk1vZGFsSW5zdGFuY2UsICR1aWJNb2RhbCwgaXRlbSwgUG9sbEZhY3RvcnkpIHtcblxuICAkc2NvcGUuaXRlbSA9IGl0ZW07XG5cbiAgJHNjb3BlLmN1c3RvbU9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAkc2NvcGUuY3VzdG9tU2hvdyA9IChvcHRpb24gPT09ICdjdXN0b20nKVxuICB9XG5cbiAgJHNjb3BlLnN1Ym1pdFBvbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBvbGwgPSB7fVxuICAgIHBvbGwucXVlc3Rpb24gPSAkc2NvcGUubmV3UG9sbFxuICAgIHBvbGwubGVjdHVyZUlkID0gMVxuICAgIGlmICgkc2NvcGUub3B0aW9uPT0nY3VzdG9tJykgcG9sbC5vcHRpb25zID0gWyRzY29wZS5hLCAkc2NvcGUuYiwgJHNjb3BlLmMsICRzY29wZS5kXVxuXG4gICAgUG9sbEZhY3RvcnkuY3JlYXRlUG9sbChwb2xsKVxuICAgIC50aGVuKCgpID0+IHsgcmV0dXJuIFBvbGxGYWN0b3J5LmdldEFsbEJ5TGVjdHVyZUlkKDEpIH0pXG4gICAgLnRoZW4oKHBvbGxzKSA9PiB7ICRzY29wZS5wb2xscyA9IHBvbGxzIH0pXG4gICAgLnRoZW4oKCkgPT4geyAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpIH0pXG4gIH1cblxuICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICB9XG59XG4iLCJhcHAuZGlyZWN0aXZlKCdmZWVkYmFjaycsICgkc3RhdGUsIEZlZWRiYWNrRmFjdG9yeSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHtcblxuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZmVlZGJhY2svZmVlZGJhY2suaHRtbCcsXG4gICAgbGluazogKHNjb3BlKSA9PiB7XG4gICAgICBzY29wZS5hZGRNZXNzYWdlID0gZmFsc2U7XG4gICAgICBzY29wZS5yZWplY3RNZXNzYWdlID0gZmFsc2U7XG5cbiAgICAgIHNjb3BlLmNvdW50RmVlZGJhY2sgPSBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcbiAgICAgICAgaWYgKChjYXRlZ29yeSA9PT0gJ0dyZWF0JyAmJiAhc2NvcGUuZ3JlYXRDbGlja2VkKSB8fCAoY2F0ZWdvcnkgPT09ICdDb25mdXNlZCcgJiYgIXNjb3BlLmNvbmZ1c2VkQ2xpY2tlZCkgfHwgKGNhdGVnb3J5ID09PSAnRXhhbXBsZScgJiYgIXNjb3BlLmV4YW1wbGVDbGlja2VkKSB8fCAoY2F0ZWdvcnkgPT09ICdDYW5ub3QgU2VlJyAmJiAhc2NvcGUuc2VlQ2xpY2tlZCkgfHwgKGNhdGVnb3J5ID09PSAnQ2Fubm90IEhlYXInICYmICFzY29wZS5oZWFyQ2xpY2tlZCkgfHwgKGNhdGVnb3J5ID09PSAnUmVxdWVzdCBCcmVhaycgJiYgIXNjb3BlLmJyZWFrQ2xpY2tlZCkpIHtcbiAgICAgICAgcmV0dXJuIEZlZWRiYWNrRmFjdG9yeS5hZGRGZWVkYmFjayhjYXRlZ29yeSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBGZWVkYmFja0ZhY3RvcnkuY291bnRGZWVkYmFjayhjYXRlZ29yeSlcbiAgICAgICAgfSkgXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBzb2NrZXQuZW1pdCgnc3VibWl0dGVkRmVlZGJhY2snLCBjYXRlZ29yeSlcbiAgICAgICAgICBcbiAgICAgICAgICBjb25zb2xlLmxvZygnSVQgSVMgSEVSRScsIHJlc3VsdClcbiAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICdHcmVhdCcpIHtcbiAgICAgICAgICAgIHNjb3BlLmdyZWF0Q291bnQgPSByZXN1bHQ7XG4gICAgICAgICAgICBzY29wZS5ncmVhdENsaWNrZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ0NvbmZ1c2VkJykge1xuICAgICAgICAgICAgc2NvcGUuY29uZnVzZWRDb3VudCA9IHJlc3VsdDtcbiAgICAgICAgICAgIHNjb3BlLmNvbmZ1c2VkQ2xpY2tlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAnRXhhbXBsZScpIHtcbiAgICAgICAgICAgIHNjb3BlLmV4YW1wbGVDb3VudCA9IHJlc3VsdDtcbiAgICAgICAgICAgIHNjb3BlLmV4YW1wbGVDbGlja2VkID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICdDYW5ub3QgU2VlJykge1xuICAgICAgICAgICAgc2NvcGUuc2VlQ291bnQgPSByZXN1bHRcbiAgICAgICAgICAgIHNjb3BlLnNlZUNsaWNrZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ0Nhbm5vdCBIZWFyJykge1xuICAgICAgICAgICAgc2NvcGUuaGVhckNvdW50ID0gcmVzdWx0O1xuICAgICAgICAgICAgc2NvcGUuaGVhckNsaWNrZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICdSZXF1ZXN0IEJyZWFrJykge1xuICAgICAgICAgICAgc2NvcGUuYnJlYWtDb3VudCA9IHJlc3VsdFxuICAgICAgICAgICAgc2NvcGUuYnJlYWtDbGlja2VkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzY29wZS5hZGRNZXNzYWdlID0gdHJ1ZVxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHNjb3BlLmFkZE1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICB9LCAxNTAwKTtcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgZWxzZSB7XG4gICAgICAgIHNjb3BlLnJlamVjdE1lc3NhZ2UgPSB0cnVlXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICBzY29wZS5yZWplY3RNZXNzYWdlID0gZmFsc2U7XG4gICAgICAgICAgc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICB9LCAxNTAwKTsgICAgICAgIFxuICAgICAgfVxuICAgIH1cblxuICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgc2NvcGUuZ3JlYXRDb3VudCA9IG51bGw7XG4gICAgICBzY29wZS5ncmVhdENsaWNrZWQgPSBudWxsO1xuICAgICAgc2NvcGUuY29uZnVzZWRDb3VudCA9IG51bGw7XG4gICAgICBzY29wZS5jb25mdXNlZENsaWNrZWQgPSBudWxsO1xuICAgICAgc2NvcGUuZXhhbXBsZUNvdW50ID0gbnVsbDtcbiAgICAgIHNjb3BlLmV4YW1wbGVDbGlja2VkID0gbnVsbDtcbiAgICAgIHNjb3BlLnNlZUNvdW50ID0gbnVsbDtcbiAgICAgIHNjb3BlLnNlZUNsaWNrZWQgPSBudWxsO1xuICAgICAgc2NvcGUuaGVhckNvdW50ID0gbnVsbDtcbiAgICAgIHNjb3BlLmhlYXJDbGlja2VkID0gbnVsbDtcbiAgICAgIHNjb3BlLmJyZWFrQ291bnQgPSBudWxsO1xuICAgICAgc2NvcGUuYnJlYWtDbGlja2VkID0gbnVsbDtcbiAgICAgIHNjb3BlLiRkaWdlc3QoKTtcbiAgICB9LCAzMCoxMDAwKVxuXG4gICAgc29ja2V0Lm9uKCd1cGRhdGVGZWVkYmFjaycsIGZ1bmN0aW9uKGNhdGVnb3J5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWNlaXZlZCAtLT4nLCBjYXRlZ29yeSlcblxuICAgICAgICByZXR1cm4gRmVlZGJhY2tGYWN0b3J5LmNvdW50RmVlZGJhY2soY2F0ZWdvcnkpIFxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7ICAgICAgICAgIFxuICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ0dyZWF0Jykge1xuICAgICAgICAgICAgc2NvcGUuZ3JlYXRDb3VudCA9IHJlc3VsdFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICdDb25mdXNlZCcpIHtcbiAgICAgICAgICAgIHNjb3BlLmNvbmZ1c2VkQ291bnQgPSByZXN1bHRcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAnRXhhbXBsZScpIHtcbiAgICAgICAgICAgIHNjb3BlLmV4YW1wbGVDb3VudCA9IHJlc3VsdFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICdDYW5ub3QgU2VlJykge1xuICAgICAgICAgICAgc2NvcGUuc2VlQ291bnQgPSByZXN1bHRcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAnQ2Fubm90IEhlYXInKSB7XG4gICAgICAgICAgICBzY29wZS5oZWFyQ291bnQgPSByZXN1bHRcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAnUmVxdWVzdCBCcmVhaycpIHtcbiAgICAgICAgICAgIHNjb3BlLmJyZWFrQ291bnQgPSByZXN1bHRcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC8vIHNjb3BlLiRkaWdlc3QoKVxuICAgIH0pXG5cbiAgfVxufVxufSlcbiIsImFwcC5mYWN0b3J5KCdGZWVkYmFja0ZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcblx0dmFyIEZlZWRiYWNrRmFjdG9yeSA9IHt9O1xuXG5cdEZlZWRiYWNrRmFjdG9yeS5hZGRGZWVkYmFjayA9IGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2ZlZWRiYWNrLycsIHtjYXRlZ29yeTogY2F0ZWdvcnl9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ2dvdEhFUkUnLCByZXN1bHQpXG5cdFx0fSlcblx0fVxuXG5cdEZlZWRiYWNrRmFjdG9yeS5jb3VudEZlZWRiYWNrID0gZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9mZWVkYmFjay9jb3VudC8nKyBjYXRlZ29yeSlcblx0XHQudGhlbihmdW5jdGlvbihyZXN1bHQgKSB7XG5cdFx0XHRyZXR1cm4gcmVzdWx0LmRhdGFcblx0XHR9KVxuXHR9XG5cblx0cmV0dXJuIEZlZWRiYWNrRmFjdG9yeVxufSkiLCJhcHAuZGlyZWN0aXZlKCdwb2xsJywgKCRzdGF0ZSwgUG9sbEZhY3RvcnkpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiB7XG4gICAgICB1c2VDdHJsOiBcIkBcIlxuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vcG9sbC9wb2xsLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlKSB7XG5cbiAgICAgIHNjb3BlLmRlbGV0ZSA9IFBvbGxGYWN0b3J5LmRlbGV0ZVBvbGxcblxuICAgICAgUG9sbEZhY3RvcnkuZ2V0QWxsQnlMZWN0dXJlSWQoMSlcbiAgICAgIC50aGVuKChjdXJyZW50UG9sbHMpID0+IHtcbiAgICAgICAgc2NvcGUucG9sbHMgPSBjdXJyZW50UG9sbHNcbiAgICAgIH0pXG5cbiAgICAgIHNjb3BlLnNlbmRQb2xsID0gZnVuY3Rpb24ocG9sbCkge1xuICAgICAgICBzb2NrZXQuZW1pdCgncG9sbE91dCcsIHBvbGwpXG4gICAgICB9XG5cbiAgICB9XG4gIH1cbn0pXG4iLCJhcHAuZmFjdG9yeSgnUG9sbEZhY3RvcnknLCAoJGh0dHApID0+IHtcbiAgZnVuY3Rpb24gZG90RGF0YShkb3QpIHtcbiAgICByZXR1cm4gZG90LmRhdGFcbiAgfVxuICB2YXIgY2FjaGVkUG9sbHMgPSBbXVxuICByZXR1cm4ge1xuICAgIGdldEFsbEJ5TGVjdHVyZUlkOiAoaWQpID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvcG9sbC9sZWN0dXJlLycraWQpXG4gICAgICAudGhlbihkb3REYXRhKVxuICAgICAgLnRoZW4oKHBvbGxzKSA9PiB7XG4gICAgICAgIGFuZ3VsYXIuY29weShwb2xscywgY2FjaGVkUG9sbHMpXG4gICAgICAgIHJldHVybiBjYWNoZWRQb2xsc1xuICAgICAgfSlcbiAgICB9LFxuICAgIGdldE9uZUJ5UG9sbElkOiAoaWQpID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvcG9sbC8nK2lkKVxuICAgICAgLnRoZW4oZG90RGF0YSlcbiAgICB9LFxuICAgIGNyZWF0ZVBvbGw6IChwb2xsT2JqKSA9PiB7XG4gICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9wb2xsLycsIHBvbGxPYmopXG4gICAgICAudGhlbihkb3REYXRhKVxuICAgIH0sXG4gICAgdXBkYXRlUG9sbDogKHBvbGxPYmosIGlkKSA9PiB7XG4gICAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL3BvbGwvJytpZCwgcG9sbE9iailcbiAgICAgIC50aGVuKGRvdERhdGEpXG4gICAgfSxcbiAgICBkZWxldGVQb2xsOiAoaWQpID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoJy9hcGkvcG9sbC8nK2lkKVxuICAgICAgLnRoZW4oZG90RGF0YSlcbiAgICAgIC50aGVuKChyZW1vdmVkUG9sbCkgPT4ge1xuICAgICAgICBjYWNoZWRQb2xscy5zcGxpY2UoY2FjaGVkUG9sbHMubWFwKGZ1bmN0aW9uKGl0ZW0pIHsgcmV0dXJuIGl0ZW0uaWQgfSkuaW5kZXhPZihpZCksMSlcbiAgICAgICAgcmV0dXJuIGNhY2hlZFBvbGxzXG4gICAgICB9KVxuICAgIH1cbiAgfVxufSlcbiIsImFwcC5kaXJlY3RpdmUoJ3F1ZXN0aW9uJywgZnVuY3Rpb24oJHN0YXRlLCBRdWVzdGlvbkZhY3RvcnkpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBpc0FkbWluOiBcIkBcIlxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9xdWVzdGlvbi9xdWVzdGlvbi5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUpIHtcblxuICAgICAgICAgICAgUXVlc3Rpb25GYWN0b3J5LmdldEFsbEJ5TGVjdHVyZUlkKDEpLnRoZW4oZnVuY3Rpb24ocXVlc3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUucXVlc3Rpb25zID0gcXVlc3Rpb25zLmZpbHRlcihmdW5jdGlvbihxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBxLnN0YXR1cyA9PT0gJ29wZW4nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmRJbmRleChxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NvcGUucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5xdWVzdGlvbnNbaV0udGV4dCA9PT0gcXVlc3Rpb24udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBtb3ZlKHF1ZXN0aW9uLCBuKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZmluZEluZGV4KHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIGlmIChpbmRleCtuID4gLTEgJiYgaW5kZXgrbiA8IHNjb3BlLnF1ZXN0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucXVlc3Rpb25zLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucXVlc3Rpb25zLnNwbGljZShpbmRleCtuLCAwLCBxdWVzdGlvbilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChzY29wZS5uZXdRdWVzdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSB7dGV4dDogc2NvcGUubmV3UXVlc3Rpb24sIHN1Ym1pdFRpbWU6IERhdGUubm93KCksIHVwdm90ZXM6IDB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBRdWVzdGlvbkZhY3Rvcnkuc3RvcmUocXVlc3Rpb24pLnRoZW4oZnVuY3Rpb24ocSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2FkZGluZ1F1ZXN0aW9uJywgcSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLm5ld1F1ZXN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2RlbGV0aW5nUXVlc3Rpb24nLCBxdWVzdGlvbilcbiAgICAgICAgICAgICAgICByZXR1cm4gUXVlc3Rpb25GYWN0b3J5LmRlbGV0ZShxdWVzdGlvbilcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2NvcGUuY2xvc2UgPSBmdW5jdGlvbihxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIHF1ZXN0aW9uLnN0YXR1cyA9ICdjbG9zZWQnXG4gICAgICAgICAgICAgICAgcmV0dXJuIFF1ZXN0aW9uRmFjdG9yeS51cGRhdGUocXVlc3Rpb24pLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2RlbGV0aW5nUXVlc3Rpb24nLCBxdWVzdGlvbilcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS5tb3ZlID0gZnVuY3Rpb24ocXVlc3Rpb24sIG4pIHtcbiAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbW92ZScsIHF1ZXN0aW9uLCBuKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS51cHZvdGUgPSBmdW5jdGlvbihxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2NvcGU6IFwiLHNjb3BlKTtcbiAgICAgICAgICAgICAgICBxdWVzdGlvbi5oYXNVcHZvdGVkID0gIXF1ZXN0aW9uLmhhc1Vwdm90ZWQ7XG4gICAgICAgICAgICAgICAgcXVlc3Rpb24udXB2b3RlcysrO1xuICAgICAgICAgICAgICAgIHNvY2tldC5lbWl0KCd1cHZvdGluZycsIHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIHJldHVybiBRdWVzdGlvbkZhY3RvcnkudXBkYXRlKHF1ZXN0aW9uKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS5kb3dudm90ZSA9IGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgcXVlc3Rpb24uaGFzVXB2b3RlZCA9ICFxdWVzdGlvbi5oYXNVcHZvdGVkO1xuICAgICAgICAgICAgICAgIHF1ZXN0aW9uLnVwdm90ZXMtLTtcbiAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnZG93bnZvdGluZycsIHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIHJldHVybiBRdWVzdGlvbkZhY3RvcnkudXBkYXRlKHF1ZXN0aW9uKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzb2NrZXQub24oJ2FkZFF1ZXN0aW9uJywgZnVuY3Rpb24ocXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICBzY29wZS5xdWVzdGlvbnMudW5zaGlmdChxdWVzdGlvbilcbiAgICAgICAgICAgICAgICBzY29wZS4kZXZhbEFzeW5jKClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHNvY2tldC5vbignZGVsZXRlUXVlc3Rpb24nLCBmdW5jdGlvbihxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGZpbmRJbmRleChxdWVzdGlvbilcbiAgICAgICAgICAgICAgICBzY29wZS5xdWVzdGlvbnMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgICAgICAgIHNjb3BlLiRldmFsQXN5bmMoKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdyZWNlaXZlZFVwdm90ZScsIGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZmluZEluZGV4KHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHNjb3BlLnF1ZXN0aW9uc1tpbmRleF1cbiAgICAgICAgICAgICAgICBxdWVzdGlvbi51cHZvdGVzKytcbiAgICAgICAgICAgICAgICBzY29wZS4kZXZhbEFzeW5jKClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHNvY2tldC5vbigncmVjZWl2ZWREb3dudm90ZScsIGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZmluZEluZGV4KHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHNjb3BlLnF1ZXN0aW9uc1tpbmRleF1cbiAgICAgICAgICAgICAgICBxdWVzdGlvbi51cHZvdGVzLS07XG4gICAgICAgICAgICAgICAgc2NvcGUuJGV2YWxBc3luYygpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBzb2NrZXQub24oJ21vdmluZycsIGZ1bmN0aW9uKHF1ZXN0aW9uLCBuKSB7XG4gICAgICAgICAgICAgICAgbW92ZShxdWVzdGlvbiwgbilcbiAgICAgICAgICAgICAgICBzY29wZS4kZXZhbEFzeW5jKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59KTtcbiIsImFwcC5mYWN0b3J5KCdRdWVzdGlvbkZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuXHR2YXIgb2JqID0ge307XG5cblx0b2JqLmdldEFsbEJ5TGVjdHVyZUlkID0gZnVuY3Rpb24obGVjdHVyZUlkKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9xdWVzdGlvbi9sZWN0dXJlLycgKyBsZWN0dXJlSWQpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSlcblx0fVxuXG5cdG9iai5zdG9yZSA9IGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvcXVlc3Rpb24nLCBxdWVzdGlvbikudGhlbihmdW5jdGlvbihyZXMpIHtcblx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHR9KVxuXHR9XG5cblx0b2JqLnVwZGF0ZSA9IGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG5cdFx0cmV0dXJuICRodHRwLnB1dCgnL2FwaS9xdWVzdGlvbi8nICsgcXVlc3Rpb24uaWQsIHF1ZXN0aW9uKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pXG5cdH1cblxuXHRvYmouZGVsZXRlID0gZnVuY3Rpb24ocXVlc3Rpb24pIHtcblx0XHRyZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBpL3F1ZXN0aW9uLycgKyBxdWVzdGlvbi5pZCkudGhlbihmdW5jdGlvbihyZXMpIHtcblx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHR9KVxuXHR9XG5cblx0cmV0dXJuIG9iajtcblxufSk7XG4iLCJhcHAuY29udHJvbGxlcignU3R1ZGVudFBvbGwnLCBmdW5jdGlvbigkc2NvcGUsICR1aWJNb2RhbCkge1xuICAkc2NvcGUuc2hvd01vZGFsID0gZnVuY3Rpb24oKSB7XG5cbiAgICAkc2NvcGUub3B0cyA9IHtcbiAgICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgICAgYmFja2Ryb3BDbGljazogdHJ1ZSxcbiAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICBkaWFsb2dGYWRlOiBmYWxzZSxcbiAgICAgIGtleWJvYXJkOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmwgOiAnanMvY29tbW9uL3N0dWRlbnRNb2RhbC9zdHVkZW50UG9sbC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXIgOiBTdHVkZW50TW9kYWxJbnN0YW5jZSxcbiAgICAgIHJlc29sdmU6IHt9IC8vIGVtcHR5IHN0b3JhZ2VcbiAgICB9O1xuXG4gICAgJHNjb3BlLm9wdHMucmVzb2x2ZS5pdGVtID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYW5ndWxhci5jb3B5KHtwb2xsOiRzY29wZS5wb2xsfSk7IC8vIHBhc3MgbmFtZSB0byBEaWFsb2dcbiAgICB9XG5cbiAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKCRzY29wZS5vcHRzKTtcblxuICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgIC8vb24gb2sgYnV0dG9uIHByZXNzXG4gICAgfSxmdW5jdGlvbigpe1xuICAgICAgLy9vbiBjYW5jZWwgYnV0dG9uIHByZXNzXG4gICAgfSlcbiAgfVxuXG4gIHNvY2tldC5vbigndG9TdHVkZW50JywgZnVuY3Rpb24ocG9sbFF1ZXN0aW9uKSB7XG4gICAgJHNjb3BlLnBvbGwgPSBwb2xsUXVlc3Rpb25cbiAgICAkc2NvcGUuc2hvd01vZGFsKClcbiAgfSlcblxufSlcblxuZnVuY3Rpb24gU3R1ZGVudE1vZGFsSW5zdGFuY2UoJHNjb3BlLCAkdWliTW9kYWxJbnN0YW5jZSwgJHVpYk1vZGFsLCBpdGVtLCBQb2xsRmFjdG9yeSkge1xuXG4gICRzY29wZS5pdGVtID0gaXRlbTtcblxuICBzb2NrZXQub24oJ3RvU3R1ZGVudCcsIGZ1bmN0aW9uKHBvbGxRdWVzdGlvbikge1xuICAgICRzY29wZS5wb2xsID0gcG9sbFF1ZXN0aW9uXG4gIH0pXG5cbiAgJHNjb3BlLnN1Ym1pdEFuc3dlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpXG4gIH1cblxufVxuIiwiZ2FwaS5oYW5nb3V0LnJlbmRlcignc3RhcnRCdXR0b24yJywge1xuJ3JlbmRlcic6ICdjcmVhdGVoYW5nb3V0JyxcbidoYW5nb3V0X3R5cGUnOiAnb25haXInLFxuJ2luaXRpYWxfYXBwcyc6IFtcbiAgICB7IGFwcF9pZCA6ICdlZmZvcnRsZXNzLWNpdHktMTM1NTIzJywgc3RhcnRfZGF0YSA6ICdkUXc0dzlXZ1hjUScsICdhcHBfdHlwZScgOiAnUk9PTV9BUFAnIH1cbl0sXG4nd2lkZ2V0X3NpemUnOiA3MlxufSk7XG5cbnZhciBxdWV1ZSA9IHtcbiAgICBjb25mdXNlZDogW10sXG4gICAgZ3JlYXQ6IFtdLFxuICAgIGV4YW1wbGU6IFtdXG59O1xuXG52YXIgZGF0YVF1ZXVlID0ge1xuICAgIGNvbmZ1c2VkOiBbXSxcbiAgICBncmVhdDogW10sXG4gICAgZXhhbXBsZTogW11cbn07XG5cbnZhciBkYXRhTGVuZ3RoPTMwO1xudmFyIHhWYWw9IGRhdGFMZW5ndGg7XG5cbmZ1bmN0aW9uIHNlZWREYXRhKG9iail7XG4gICAgZm9yICh2YXIgY2F0ZWdvcnkgaW4gb2JqKXtcbiAgICAgICAgdmFyIHRlbXBJbmRleD0wO1xuICAgICAgICB3aGlsZSAob2JqW2NhdGVnb3J5XS5sZW5ndGg8ZGF0YUxlbmd0aCl7XG4gICAgICAgICAgICBvYmpbY2F0ZWdvcnldLnB1c2goe3g6dGVtcEluZGV4LCB5OjB9KTtcbiAgICAgICAgICAgIHRlbXBJbmRleCsrO1xuICAgICAgICB9XG4gICAgfVxufVxuc2VlZERhdGEocXVldWUpO1xuXG52YXIgY2hhcnRDb2RlID0gbmV3IENhbnZhc0pTLkNoYXJ0KFwiY2hhcnRDb2RlXCIse1xuICAgIGNyZWRpdFRleHQ6IFwiXCIsXG4gICAgdGl0bGUgOntcbiAgICAgICAgdGV4dDogXCJMaXZlIEZlZWRiYWNrXCIsXG4gICAgICAgIGZvbnRDb2xvcjogXCJ3aGl0ZVwiXG4gICAgfSwgIFxuICAgIGJhY2tncm91bmRDb2xvcjogbnVsbCwgICAgICAgIFxuICAgIGF4aXNYOiB7XG4gICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgIHZhbHVlRm9ybWF0U3RyaW5nOiBcIiBcIixcbiAgICAgICAgbGluZVRoaWNrbmVzczogMFxuICAgIH0sXG4gICAgYXhpc1k6IHtcbiAgICAgICAgbWluaW11bTogLTUsXG4gICAgICAgIG1heGltdW06IDEwLFxuICAgICAgICB0aWNrTGVuZ3RoOiAwLFxuICAgICAgICBncmlkVGhpY2tuZXNzOiAwLFxuICAgICAgICBsYWJlbEZvbnRDb2xvcjogJ3doaXRlJyxcbiAgICAgICAgbGluZUNvbG9yOiAnd2hpdGUnXG4gICAgfSxcbiAgICBsZWdlbmQ6e1xuICAgICAgICB2ZXJ0aWNhbEFsaWduOiBcImJvdHRvbVwiLFxuICAgICAgICBob3Jpem9udGFsQWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgIGZvbnRTaXplOiAxMixcbiAgICAgICAgY3Vyc29yOlwicG9pbnRlclwiLFxuICAgICAgICBpdGVtY2xpY2sgOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZihlLmRhdGFTZXJpZXMudmlzaWJsZSkgPT09IFwidW5kZWZpbmVkXCIgfHwgZS5kYXRhU2VyaWVzLnZpc2libGUpIHtcbiAgICAgICAgICBlLmRhdGFTZXJpZXMudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGUuZGF0YVNlcmllcy52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2hhcnRRdWVzdGlvbi5yZW5kZXIoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGF0YTogW3tcbiAgICAgICAgbWFya2VyVHlwZTogJ25vbmUnLFxuICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgdHlwZTogXCJsaW5lXCIsXG4gICAgICAgIHNob3dJbkxlZ2VuZDogdHJ1ZSxcbiAgICAgICAgbmFtZTogXCJDb25mdXNlZFwiLFxuICAgICAgICBkYXRhUG9pbnRzOiBxdWV1ZVsnY29uZnVzZWQnXVxuICAgIH0sXG4gICAge1xuICAgICAgICBtYXJrZXJUeXBlOiAnbm9uZScsXG4gICAgICAgIGNvbG9yOiAncmVkJyxcbiAgICAgICAgdHlwZTogXCJsaW5lXCIsXG4gICAgICAgIHNob3dJbkxlZ2VuZDogdHJ1ZSxcbiAgICAgICAgbmFtZTogXCJFeGFtcGxlXCIsXG4gICAgICAgIGRhdGFQb2ludHM6IHF1ZXVlWydleGFtcGxlJ11cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbWFya2VyVHlwZTogJ25vbmUnLFxuICAgICAgICBjb2xvcjogJ2JsdWUnLFxuICAgICAgICB0eXBlOiBcImxpbmVcIixcbiAgICAgICAgc2hvd0luTGVnZW5kOiB0cnVlLFxuICAgICAgICBuYW1lOiBcIkdyZWF0XCIsXG4gICAgICAgIGRhdGFQb2ludHM6IHF1ZXVlWydncmVhdCddXG4gICAgfVxuICAgIF1cbn0pO1xuXG52YXIgdXBkYXRlQ2hhcnQgPSBmdW5jdGlvbiAoKSB7ICAgIFxuICAgIHhWYWwrKztcbiAgICBcbiAgICBxdWV1ZVsnY29uZnVzZWQnXS5wdXNoKHt4OiB4VmFsLCB5OjArZGF0YVF1ZXVlWydjb25mdXNlZCddLmxlbmd0aH0pO1xuICAgIHF1ZXVlWydleGFtcGxlJ10ucHVzaCh7eDogeFZhbCwgeTowK2RhdGFRdWV1ZVsnZXhhbXBsZSddLmxlbmd0aH0pO1xuICAgIHF1ZXVlWydncmVhdCddLnB1c2goe3g6IHhWYWwsIHk6MCtkYXRhUXVldWVbJ2dyZWF0J10ubGVuZ3RofSk7XG5cbiAgICBpZiAocXVldWVbJ2NvbmZ1c2VkJ10ubGVuZ3RoID4gZGF0YUxlbmd0aCkgcXVldWVbJ2NvbmZ1c2VkJ10uc2hpZnQoKTsgICAgICAgICAgICAgICAgXG4gICAgaWYgKHF1ZXVlWydleGFtcGxlJ10ubGVuZ3RoID4gZGF0YUxlbmd0aCkgcXVldWVbJ2V4YW1wbGUnXS5zaGlmdCgpOyAgXG4gICAgaWYgKHF1ZXVlWydncmVhdCddLmxlbmd0aCA+IGRhdGFMZW5ndGgpIHF1ZXVlWydncmVhdCddLnNoaWZ0KCk7ICAgICAgICAgICAgICAgIFxuXG4gICAgY2hhcnRDb2RlLnJlbmRlcigpOyAgXG5cbiAgICBkYXRhUXVldWVbJ2NvbmZ1c2VkJ109W107XG4gICAgZGF0YVF1ZXVlWydleGFtcGxlJ109W107XG4gICAgZGF0YVF1ZXVlWydncmVhdCddPVtdO1xuXG59O1xuXG5mdW5jdGlvbiB1cGRhdGVJbnN0cnVjdG9yVmlldygpe1xuICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgIHVwZGF0ZUNoYXJ0KCk7XG4gICAgfSwgMTAwMCk7IFxufTtcblxudXBkYXRlSW5zdHJ1Y3RvclZpZXcoKTtcblxuc29ja2V0Lm9uKCd1cGRhdGVGZWVkYmFjaycsIGZ1bmN0aW9uIChkYXRhKSB7XG4gIGNvbnNvbGUubG9nKFwiQXBwIHJlY2VpdmVkIGJhY2s6IFwiLGRhdGEpO1xuICBkYXRhID0gZGF0YS50b0xvd2VyQ2FzZSgpO1xuICBkYXRhUXVldWVbZGF0YV0ucHVzaChcImluc3RhbmNlXCIpO1xufSk7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG4gICAgJCgnLnN0YXJ0JykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCQodGhpcykuaHRtbCgpPT0nU3RhcnQnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRyaWdnZXIgc3RhcnRcIik7XG4gICAgICAgICAgICAkLnBvc3QoJ2FwaS9sZWN0dXJlL3N0YXJ0Jyx7bmFtZTogXCJEZW1vIExlY3R1cmVcIiwgbGVjdHVyZXI6IFwiT21yaVwiLCBzdGFydFRpbWU6IE1hdGguZmxvb3IoRGF0ZS5ub3coKS8xMDAwKX0pO1xuICAgICAgICAgICAgJCh0aGlzKS5odG1sKCdTdG9wJyk7XG4gICAgICAgICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICdyZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidHJpZ2dlciBzdG9wXCIpO1xuICAgICAgICAgICAgJC5wb3N0KCdhcGkvbGVjdHVyZS9lbmQnLHtpZDogMSwgZW5kVGltZTogTWF0aC5mbG9vcihEYXRlLm5vdygpLzEwMDApfSk7XG4gICAgICAgICAgICAkKHRoaXMpLmh0bWwoJ1N0YXJ0Jyk7XG4gICAgICAgICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsICdncmVlbicpO1xuICAgICAgICB9XG4gICAgfSlcblxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
