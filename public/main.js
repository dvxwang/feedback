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
<<<<<<< HEAD
=======
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

>>>>>>> master
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

  // $scope.customOptions = function(option) {
  //   $scope.customShow = (option === 'custom')
  // }

  $scope.submitPoll = function () {
    var poll = {};
    poll.question = $scope.newPoll;
    poll.lectureId = 1;
    // poll.options = [{'a': $scope.a}, {'b': $scope.b}, {'c': $scope.c}]
    poll.options = [$scope.a, $scope.b, $scope.c];
    var check = poll.options.reduce(function (prev, next) {
      return prev && (next != undefined || next != null);
    }, true);
    if (check) {
      PollFactory.createPoll(poll).then(function () {
        return PollFactory.getAllByLectureId(1);
      }).then(function (polls) {
        $scope.polls = polls;
      }).then(function () {
        $uibModalInstance.close();
      });
    } else {
      alert("You must add at least one question to the poll!");
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};

app.directive('activePoll', function ($state, PollFactory, PollAnswerFactory) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/livePoll/activePoll.html',
    link: function link(scope) {
      socket.on('toStudent', function (pollQuestion) {
        console.log("hello");
        scope.poll = pollQuestion;
        scope.$digest();
      });
      // PollAnswerFactory.getAllByPollId(scope.poll.id)
      // .then((answers)=> {
      //   scope.answers = answers
      // })
      socket.on('updateActivePoll', function () {
        PollAnswerFactory.getAllByPollId(scope.poll.id).then(function (answers) {
          scope.answers = answers;
          scope.counted = countAnswers(scope.answers);
        });
        scope.$digest();
      });

      function countAnswers(answers) {
        var counted = {};
        answers.forEach(function (answer) {
          if (!counted[answer.option]) counted[answer.option] = 1;else counted[answer.option] += 1;
        });
        return counted;
      }
    }
  };
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

app.factory('PollAnswerFactory', function ($http) {
  function dotData(dot) {
    return dot.data;
  }
  var cachedAnswers = [];
  return {
    getAllByPollId: function getAllByPollId(id) {
      return $http.get('/api/answer/' + id).then(dotData).then(function (answers) {
        angular.copy(answers, cachedAnswers);
        return cachedAnswers;
      });
    },
    answerPoll: function answerPoll(pollObj) {
      return $http.post('/api/answer/', pollObj).then(dotData);
    }
  };
});

app.directive('question', function ($state, QuestionFactory) {

  return {
    restrict: 'E',
    scope: {},
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

function StudentModalInstance($scope, $uibModalInstance, $uibModal, item, PollFactory, PollAnswerFactory) {

  $scope.item = item;

  $scope.submitAnswer = function () {
    var answer = {
      pollId: $scope.item.poll.id,
      option: $scope.answer
    };

    PollAnswerFactory.answerPoll(answer).then(function () {
      socket.emit('studentAnswer');
      $uibModalInstance.close();
    });
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

  // $('.start').click(function(){
  //     if ($(this).html()=='Start') {
  //         console.log("trigger start");
  //         $.post('/addFeedback',{message:"start", time: Math.floor(Date.now()/1000)});
  //         $(this).html('Stop');
  //         $(this).css('background-color', 'red');
  //     }
  //     else {
  //         console.log("trigger stop");
  //         $.post('/addFeedback',{message:"stop", time: Math.floor(Date.now()/1000)});
  //         $(this).html('Start');
  //         $(this).css('background-color', 'green');
  //     }
  // })

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInNvY2tldC5qcyIsImNvbW1vbi9jcmVhdGVQb2xsTW9kYWwvY3JlYXRlUG9sbC5jb250cm9sbGVyLmpzIiwiY29tbW9uL2ZlZWRiYWNrL2ZlZWRiYWNrLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9mZWVkYmFjay9mZWVkYmFjay5mYWN0b3J5LmpzIiwiY29tbW9uL3BvbGwvcG9sbC5kaXJlY3RpdmUuanMiLCJjb21tb24vcG9sbC9wb2xsLmZhY3RvcnkuanMiLCJjb21tb24vcXVlc3Rpb24vcXVlc3Rpb24uZGlyZWN0aXZlLmpzIiwiY29tbW9uL3F1ZXN0aW9uL3F1ZXN0aW9uLmZhY3RvcnkuanMiLCJjb21tb24vc3R1ZGVudE1vZGFsL3N0dWRlbnRQb2xsLmNvbnRyb2xsZXIuanMiLCJ2aWV3cy9pbnN0cnVjdG9yL2luc3RydWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsT0FBQSxHQUFBLEdBQUEsUUFBQSxNQUFBLENBQUEsT0FBQSxFQUFBLENBQUEsV0FBQSxFQUFBLGNBQUEsRUFBQSxXQUFBLEVBQUEsV0FBQSxDQUFBLENBQUE7O0FBRUEsSUFBQSxNQUFBLENBQUEsVUFBQSxrQkFBQSxFQUFBLGlCQUFBLEVBQUEsZ0JBQUEsRUFBQTs7QUFFQSxvQkFBQSxTQUFBLENBQUEsSUFBQTs7QUFFQSxxQkFBQSxTQUFBLENBQUEsR0FBQTs7QUFFQSxxQkFBQSxJQUFBLENBQUEsaUJBQUEsRUFBQSxZQUFBO0FBQ0EsV0FBQSxRQUFBLENBQUEsTUFBQTtBQUNBLEdBRkE7O0FBSUEsbUJBQUEsTUFBQSxDQUFBLElBQUEsR0FBQSxJQUFBO0FBRUEsQ0FaQTs7QUFjQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGlCQUFBLEtBQUEsQ0FBQSxTQUFBLEVBQUE7QUFDQSxTQUFBLFVBREE7QUFFQSxpQkFBQTtBQUZBLEdBQUE7QUFJQSxDQUxBOztBQU9BLElBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFB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QUdBLENBdkJBOztBQzlCQSxJQUFBLFNBQUEsQ0FBQSxVQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsZUFBQSxFQUFBO0FBQ0EsU0FBQTtBQUNBLGNBQUEsR0FEQTtBQUVBLFdBQUEsRUFGQTtBQUtBLGlCQUFBLGtDQUxBO0FBTUEsVUFBQSxjQUFBLEtBQUEsRUFBQTtBQUNBLFlBQUEsVUFBQSxHQUFBLEtBQUE7QUFDQSxZQUFBLGFBQUEsR0FBQSxLQUFBOztBQUVBLFlBQUEsYUFBQSxHQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsWUFBQSxhQUFBLE9BQUEsSUFBQSxDQUFBLE1BQUEsWUFBQSxJQUFBLGFBQUEsVUFBQSxJQUFBLENBQUEsTUFBQSxlQUFBLElBQUEsYUFBQSxTQUFBLElBQUEsQ0FBQSxNQUFBLGNBQUEsSUFBQSxhQUFBLFlBQUEsSUFBQSxDQUFBLE1BQUEsVUFBQSxJQUFBLGFBQUEsYUFBQSxJQUFBLENBQUEsTUFBQSxXQUFBLElBQUEsYUFBQSxlQUFBLElBQUEsQ0FBQSxNQUFBLFlBQUEsRUFBQTtBQUNBLGlCQUFBLGdCQUFBLFdBQUEsQ0FBQSxRQUFBLEVBQ0EsSUFEQSxDQUNBLFlBQUE7QUFDQSxtQkFBQSxnQkFBQSxhQUFBLENBQUEsUUFBQSxDQUFBO0FBQ0EsV0FIQSxFQUlBLElBSkEsQ0FJQSxVQUFBLE1BQUEsRUFBQTtBQUNBLG1CQUFBLElBQUEsQ0FBQSxtQkFBQSxFQUFBLFFBQUE7O0FBRUEsb0JBQUEsR0FBQSxDQUFBLFlBQUEsRUFBQSxNQUFBO0FBQ0EsZ0JBQUEsYUFBQSxPQUFBLEVBQUE7QUFDQSxvQkFBQSxVQUFBLEdBQUEsTUFBQTtBQUNBLG9CQUFBLFlBQUEsR0FBQSxJQUFBO0FBQ0E7QUFDQSxnQkFBQSxhQUFBLFVBQUEsRUFBQTtBQUNBLG9CQUFBLGFBQUEsR0FBQSxNQUFBO0FBQ0Esb0JBQUEsZUFBQSxHQUFBLElBQUE7QUFDQTtBQUNBLGdCQUFBLGFBQUEsU0FBQSxFQUFBO0FBQ0Esb0JBQUEsWUFBQSxHQUFBLE1BQUE7QUFDQSxvQkFBQSxjQUFBLEdBQUEsSUFB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QUEsU0FBQSxDQUFBLENBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxJQUFBLEVBQUE7QUFDQSxtQkFBQSxDQUFBO0FBQ0E7QUFDQTtBQUNBLGVBQUEsQ0FBQSxDQUFBO0FBQ0E7O0FBRUEsZUFBQSxJQUFBLENBQUEsUUFBQSxFQUFBLENBQUEsRUFBQTtBQUNBLFlBQUEsUUFBQSxVQUFBLFFBQUEsQ0FBQTtBQUNBLFlBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsUUFBQSxDQUFBLEdBQUEsTUFBQSxTQUFBLENBQUEsTUFBQSxFQUFBO0FBQ0EsZ0JBQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxLQUFBLEVBQUEsQ0FBQTtBQUNBLGdCQUFBLFNBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLFFBQUE7QUFDQTtBQUNBOztBQUVBLFlBQUEsTUFBQSxHQUFBLFlBQUE7QUFDQSxZQUFBLE1BQUEsV0FBQSxFQUFBO0FBQ0EsY0FBQSxXQUFBLEVBQUEsTUFBQSxNQUFBLFdBQUEsRUFBQSxZQUFBLEtBQUEsR0FBQSxFQUFBLEVBQUEsU0FBQSxDQUFBLEVBQUE7QUFDQSxpQkFBQSxnQkFBQSxLQUFBLENBQUEsUUFBQSxFQUFBLElBQUEsQ0FBQSxVQUFBLENBQUEsRUFBQTtBQUNBLG1CQUFBLElBQUEsQ0FBQSxnQkFBQSxFQUFBLENBQUE7QUFDQSxrQkFBQSxXQUFBLEdBQUEsSUFBQTtBQUNBLFdBSEEsQ0FBQTtBQUlBO0FBQ0EsT0FSQTs7QUFVQSxZQUFBLE1BQUEsR0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLGVBQUEsSUFBQSxDQUFBLGtCQUFBLEVBQUEsUUFBQTtBQUNBLGVBQUEsZ0JBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQTtBQUNBLE9BSEE7O0FBS0EsWUFBQSxLQUFBLEdBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxpQkFBQSxNQUFBLEdBQUEsUUFBQTtBQUNBLGVBQUEsZ0JBQUEsTUFBQSxDQUFBLFFBQUEsRUFBQSxJQUFBLENBQUEsWUFBQTtBQUNBLGlCQUFBLElBQUEsQ0FBQSxrQkFBQSxFQUFBLFFBQUE7QUFDQSxTQUZBLENBQUE7QUFHQSxPQUxBOztBQU9BLFlBQUEsSUFBQSxHQUFBLFVBQUEsUUFBQSxFQUFBLENBQUEsRUFBQTtBQUNBLGVBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUEsQ0FBQTtBQUNBLE9BRkE7O0FBSUEsWUFBQSxNQUFBLEdBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxpQkFBQSxVQUFBLEdBQUEsQ0FBQSxTQUFBLFVBQUE7QUFDQSxpQkFBQSxPQUFBO0FBQ0EsZUFBQSxJQUFBLENBQUEsVUFBQSxFQUFBLFFBQUE7QUFDQSxlQUFBLGdCQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUE7QUFDQSxPQUxBOztBQU9BLFlBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsaUJBQUEsVUFBQSxHQUFBLENBQUEsU0FBQSxVQUFBO0FBQ0EsaUJBQUEsT0FBQTtBQUNBLGVBQUEsSUFBQSxDQUFBLFlBQUEsRUFBQSxRQUFBO0FBQ0EsZUFBQSxnQkFBQSxNQUFBLENBQUEsUUFBQSxDQUFBO0FBQ0EsT0FMQTs7QUFPQSxhQUFBLEVBQUEsQ0FBQSxhQUFBLEVBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxjQUFBLFNBQUEsQ0FBQSxPQUFBLENBQUEsUUFBQTtBQUNBLGNBQUEsVUFBQTtBQUNBLE9BSEE7O0FBS0EsYUFBQSxFQUFBLENBQUEsZ0JBQUEsRUFBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLFlBQUEsUUFBQSxVQUFBLFFBQUEsQ0FBQTtBQUNBLGNBQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxLQUFBLEVBQUEsQ0FBQTtBQUNBLGNBQUEsVUFBQTtBQUNBLE9BSkE7O0FBTUEsYUFBQSxFQUFBLENBQUEsZ0JBQUEsRUFBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLFlBQUEsUUFBQSxVQUFBLFFBQUEsQ0FBQTtBQUNBLFlBQUEsV0FBQSxNQUFBLFNBQUEsQ0FBQSxLQUFBLENBQUE7QUFDQSxpQkFBQSxPQUFBO0FBQ0EsY0FBQSxVQUFBO0FBQ0EsT0FMQTs7QUFP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SUFBQSxFQUFBLEdBQUEsSUFBQSxVQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUE7O0FBRUEsTUFBQSxNQUFBLFVBQUEsRUFBQSxNQUFBLEdBQUEsVUFBQSxFQUFBLE1BQUEsVUFBQSxFQUFBLEtBQUE7QUFDQSxNQUFBLE1BQUEsU0FBQSxFQUFBLE1BQUEsR0FBQSxVQUFBLEVBQUEsTUFBQSxTQUFBLEVBQUEsS0FBQTtBQUNBLE1BQUEsTUFBQSxPQUFBLEVBQUEsTUFBQSxHQUFBLFVBQUEsRUFBQSxNQUFBLE9BQUEsRUFBQSxLQUFBOztBQUVBLFlBQUEsTUFBQTs7QUFFQSxZQUFBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsWUFBQSxTQUFBLElBQUEsRUFBQTtBQUNBLFlBQUEsT0FBQSxJQUFBLEVBQUE7QUFFQSxDQWpCQTs7QUFtQkEsU0FBQSxvQkFBQSxHQUFBO0FBQ0EsY0FBQSxZQUFBO0FBQ0E7QUFDQSxHQUZBLEVBRUEsSUFGQTtBQUdBOztBQUVBOztBQUVBLE9BQUEsRUFBQSxDQUFBLGdCQUFBLEVBQUEsVUFBQSxJQUFBLEVBQUE7QUFDQSxVQUFBLEdBQUEsQ0FBQSxxQkFBQSxFQUFBLElBQUE7QUFDQSxTQUFBLEtBQUEsV0FBQSxFQUFBO0FBQ0EsWUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLFVBQUE7QUFDQSxDQUpBOztBQU1BLEVBQUEsUUFBQSxFQUFBLEtBQUEsQ0FBQSxZQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxDQWxCQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG53aW5kb3cuYXBwID0gYW5ndWxhci5tb2R1bGUoJ015QXBwJywgWyd1aS5yb3V0ZXInLCAndWkuYm9vdHN0cmFwJywgJ25nQW5pbWF0ZScsICduZ0tvb2tpZXMnXSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRrb29raWVzUHJvdmlkZXIpIHtcbiAgICAvLyBUaGlzIHR1cm5zIG9mZiBoYXNoYmFuZyB1cmxzICgvI2Fib3V0KSBhbmQgY2hhbmdlcyBpdCB0byBzb21ldGhpbmcgbm9ybWFsICgvYWJvdXQpXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgIC8vIElmIHdlIGdvIHRvIGEgVVJMIHRoYXQgdWktcm91dGVyIGRvZXNuJ3QgaGF2ZSByZWdpc3RlcmVkLCBnbyB0byB0aGUgXCIvXCIgdXJsLlxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbiAgICAvLyBUcmlnZ2VyIHBhZ2UgcmVmcmVzaCB3aGVuIGFjY2Vzc2luZyBhbiBPQXV0aCByb3V0ZVxuICAgICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcvYXV0aC86cHJvdmlkZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KTtcblxuICAgICRrb29raWVzUHJvdmlkZXIuY29uZmlnLmpzb24gPSB0cnVlO1xuXG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc3R1ZGVudCcsIHtcbiAgICAgICAgdXJsOiAnL3N0dWRlbnQnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3ZpZXdzL3N0dWRlbnQvc3R1ZGVudC5odG1sJyxcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbicsIHtcbiAgICAgICAgdXJsOiAnL2FkbWluJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy92aWV3cy9pbnN0cnVjdG9yL2luc3RydWN0b3IuaHRtbCcsXG4gICAgfSk7XG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc3VtbWFyeScsIHtcbiAgICAgICAgdXJsOiAnL3N1bW1hcnknLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3ZpZXdzL3N1bW1hcnkvc3VtbWFyeS5odG1sJyxcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlKSB7XG5cblx0Y29uc29sZS5sb2coXCJyZWFjaGVkIGxvZ2luIGN0cmxcIik7XG5cdCRzY29wZS5sb2dpblN0YXR1cyA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coXCJyZWFjaGVkIGxvZ2luIHN0YXR1c1wiKTtcblx0XHR2YXIgdGVtcCA9ICRzY29wZS5sb2dpbjtcblx0XHRjb25zb2xlLmxvZyhcInRlbXA6IFwiLHRlbXApO1xuXG5cdFx0aWYgKHRlbXA9PT0nYWRtaW4nKXtcblx0XHRcdCRzdGF0ZS5nbygnYWRtaW4nKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodGVtcD09PSdzdHVkZW50Jyl7XG5cdFx0XHQkc3RhdGUuZ28oJ3N0dWRlbnQnKTtcblx0XHR9XG4gICAgICAgIGVsc2UgaWYgKHRlbXA9PT0nc3VtbWFyeScpe1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdzdW1tYXJ5Jyk7XG4gICAgICAgIH1cblx0fVxuXG59KTtcbiIsInZhciBzb2NrZXQgPSBpbyh3aW5kb3cubG9jYXRpb24ub3JpZ2luKTsiLCJhcHAuY29udHJvbGxlcignQ3JlYXRlUG9sbCcsIGZ1bmN0aW9uKCRzY29wZSwgJHVpYk1vZGFsKSB7XG5cbiAgJHNjb3BlLnNob3dNb2RhbCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgJHNjb3BlLm9wdHMgPSB7XG4gICAgYmFja2Ryb3A6IHRydWUsXG4gICAgYmFja2Ryb3BDbGljazogdHJ1ZSxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIGRpYWxvZ0ZhZGU6IGZhbHNlLFxuICAgIGtleWJvYXJkOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsIDogJ2pzL2NvbW1vbi9jcmVhdGVQb2xsTW9kYWwvY3JlYXRlUG9sbE1vZGFsLmh0bWwnLFxuICAgIGNvbnRyb2xsZXIgOiBNb2RhbEluc3RhbmNlQ3RybCxcbiAgICByZXNvbHZlOiB7fSAvLyBlbXB0eSBzdG9yYWdlXG4gICAgICB9O1xuXG4gICAgJHNjb3BlLm9wdHMucmVzb2x2ZS5pdGVtID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhbmd1bGFyLmNvcHkoe3BvbGxzOiRzY29wZS5wb2xsc30pOyAvLyBwYXNzIG5hbWUgdG8gRGlhbG9nXG4gICAgfVxuXG4gICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKCRzY29wZS5vcHRzKTtcblxuICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAvL29uIG9rIGJ1dHRvbiBwcmVzc1xuICAgICAgfSxmdW5jdGlvbigpe1xuICAgICAgICAvL29uIGNhbmNlbCBidXR0b24gcHJlc3NcbiAgICAgIH0pXG4gIH1cblxufSlcblxudmFyIE1vZGFsSW5zdGFuY2VDdHJsID0gZnVuY3Rpb24oJHNjb3BlLCAkdWliTW9kYWxJbnN0YW5jZSwgJHVpYk1vZGFsLCBpdGVtLCBQb2xsRmFjdG9yeSkge1xuXG4gICRzY29wZS5pdGVtID0gaXRlbTtcblxuICAkc2NvcGUuY3VzdG9tT3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICRzY29wZS5jdXN0b21TaG93ID0gKG9wdGlvbiA9PT0gJ2N1c3RvbScpXG4gIH1cblxuICAkc2NvcGUuc3VibWl0UG9sbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcG9sbCA9IHt9XG4gICAgcG9sbC5xdWVzdGlvbiA9ICRzY29wZS5uZXdQb2xsXG4gICAgcG9sbC5sZWN0dXJlSWQgPSAxXG4gICAgaWYgKCRzY29wZS5vcHRpb249PSdjdXN0b20nKSBwb2xsLm9wdGlvbnMgPSBbJHNjb3BlLmEsICRzY29wZS5iLCAkc2NvcGUuYywgJHNjb3BlLmRdXG5cbiAgICBQb2xsRmFjdG9yeS5jcmVhdGVQb2xsKHBvbGwpXG4gICAgLnRoZW4oKCkgPT4geyByZXR1cm4gUG9sbEZhY3RvcnkuZ2V0QWxsQnlMZWN0dXJlSWQoMSkgfSlcbiAgICAudGhlbigocG9sbHMpID0+IHsgJHNjb3BlLnBvbGxzID0gcG9sbHMgfSlcbiAgICAudGhlbigoKSA9PiB7ICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCkgfSlcbiAgfVxuXG4gICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gIH1cbn1cbiIsImFwcC5kaXJlY3RpdmUoJ2ZlZWRiYWNrJywgKCRzdGF0ZSwgRmVlZGJhY2tGYWN0b3J5KSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZToge1xuXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9mZWVkYmFjay9mZWVkYmFjay5odG1sJyxcbiAgICBsaW5rOiAoc2NvcGUpID0+IHtcbiAgICAgIHNjb3BlLmFkZE1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgIHNjb3BlLnJlamVjdE1lc3NhZ2UgPSBmYWxzZTtcblxuICAgICAgc2NvcGUuY291bnRGZWVkYmFjayA9IGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuICAgICAgICBpZiAoKGNhdGVnb3J5ID09PSAnR3JlYXQnICYmICFzY29wZS5ncmVhdENsaWNrZWQpIHx8IChjYXRlZ29yeSA9PT0gJ0NvbmZ1c2VkJyAmJiAhc2NvcGUuY29uZnVzZWRDbGlja2VkKSB8fCAoY2F0ZWdvcnkgPT09ICdFeGFtcGxlJyAmJiAhc2NvcGUuZXhhbXBsZUNsaWNrZWQpIHx8IChjYXRlZ29yeSA9PT0gJ0Nhbm5vdCBTZWUnICYmICFzY29wZS5zZWVDbGlja2VkKSB8fCAoY2F0ZWdvcnkgPT09ICdDYW5ub3QgSGVhcicgJiYgIXNjb3BlLmhlYXJDbGlja2VkKSB8fCAoY2F0ZWdvcnkgPT09ICdSZXF1ZXN0IEJyZWFrJyAmJiAhc2NvcGUuYnJlYWtDbGlja2VkKSkge1xuICAgICAgICByZXR1cm4gRmVlZGJhY2tGYWN0b3J5LmFkZEZlZWRiYWNrKGNhdGVnb3J5KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIEZlZWRiYWNrRmFjdG9yeS5jb3VudEZlZWRiYWNrKGNhdGVnb3J5KVxuICAgICAgICB9KSBcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIHNvY2tldC5lbWl0KCdzdWJtaXR0ZWRGZWVkYmFjaycsIGNhdGVnb3J5KVxuICAgICAgICAgIFxuICAgICAgICAgIGNvbnNvbGUubG9nKCdJVCBJUyBIRVJFJywgcmVzdWx0KVxuICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ0dyZWF0Jykge1xuICAgICAgICAgICAgc2NvcGUuZ3JlYXRDb3VudCA9IHJlc3VsdDtcbiAgICAgICAgICAgIHNjb3BlLmdyZWF0Q2xpY2tlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAnQ29uZnVzZWQnKSB7XG4gICAgICAgICAgICBzY29wZS5jb25mdXNlZENvdW50ID0gcmVzdWx0O1xuICAgICAgICAgICAgc2NvcGUuY29uZnVzZWRDbGlja2VkID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICdFeGFtcGxlJykge1xuICAgICAgICAgICAgc2NvcGUuZXhhbXBsZUNvdW50ID0gcmVzdWx0O1xuICAgICAgICAgICAgc2NvcGUuZXhhbXBsZUNsaWNrZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ0Nhbm5vdCBTZWUnKSB7XG4gICAgICAgICAgICBzY29wZS5zZWVDb3VudCA9IHJlc3VsdFxuICAgICAgICAgICAgc2NvcGUuc2VlQ2xpY2tlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAnQ2Fubm90IEhlYXInKSB7XG4gICAgICAgICAgICBzY29wZS5oZWFyQ291bnQgPSByZXN1bHQ7XG4gICAgICAgICAgICBzY29wZS5oZWFyQ2xpY2tlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ1JlcXVlc3QgQnJlYWsnKSB7XG4gICAgICAgICAgICBzY29wZS5icmVha0NvdW50ID0gcmVzdWx0XG4gICAgICAgICAgICBzY29wZS5icmVha0NsaWNrZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNjb3BlLmFkZE1lc3NhZ2UgPSB0cnVlXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgc2NvcGUuYWRkTWVzc2FnZSA9IGZhbHNlO1xuICAgICAgICAgICAgc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgIH0sIDE1MDApO1xuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBlbHNlIHtcbiAgICAgICAgc2NvcGUucmVqZWN0TWVzc2FnZSA9IHRydWVcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgIHNjb3BlLnJlamVjdE1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgICAgICBzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgIH0sIDE1MDApOyAgICAgICAgXG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICBzY29wZS5ncmVhdENvdW50ID0gbnVsbDtcbiAgICAgIHNjb3BlLmdyZWF0Q2xpY2tlZCA9IG51bGw7XG4gICAgICBzY29wZS5jb25mdXNlZENvdW50ID0gbnVsbDtcbiAgICAgIHNjb3BlLmNvbmZ1c2VkQ2xpY2tlZCA9IG51bGw7XG4gICAgICBzY29wZS5leGFtcGxlQ291bnQgPSBudWxsO1xuICAgICAgc2NvcGUuZXhhbXBsZUNsaWNrZWQgPSBudWxsO1xuICAgICAgc2NvcGUuc2VlQ291bnQgPSBudWxsO1xuICAgICAgc2NvcGUuc2VlQ2xpY2tlZCA9IG51bGw7XG4gICAgICBzY29wZS5oZWFyQ291bnQgPSBudWxsO1xuICAgICAgc2NvcGUuaGVhckNsaWNrZWQgPSBudWxsO1xuICAgICAgc2NvcGUuYnJlYWtDb3VudCA9IG51bGw7XG4gICAgICBzY29wZS5icmVha0NsaWNrZWQgPSBudWxsO1xuICAgICAgc2NvcGUuJGRpZ2VzdCgpO1xuICAgIH0sIDMwKjEwMDApXG5cbiAgICBzb2NrZXQub24oJ3VwZGF0ZUZlZWRiYWNrJywgZnVuY3Rpb24oY2F0ZWdvcnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3JlY2VpdmVkIC0tPicsIGNhdGVnb3J5KVxuXG4gICAgICAgIHJldHVybiBGZWVkYmFja0ZhY3RvcnkuY291bnRGZWVkYmFjayhjYXRlZ29yeSkgXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHsgICAgICAgICAgXG4gICAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAnR3JlYXQnKSB7XG4gICAgICAgICAgICBzY29wZS5ncmVhdENvdW50ID0gcmVzdWx0XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ0NvbmZ1c2VkJykge1xuICAgICAgICAgICAgc2NvcGUuY29uZnVzZWRDb3VudCA9IHJlc3VsdFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICdFeGFtcGxlJykge1xuICAgICAgICAgICAgc2NvcGUuZXhhbXBsZUNvdW50ID0gcmVzdWx0XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ0Nhbm5vdCBTZWUnKSB7XG4gICAgICAgICAgICBzY29wZS5zZWVDb3VudCA9IHJlc3VsdFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICdDYW5ub3QgSGVhcicpIHtcbiAgICAgICAgICAgIHNjb3BlLmhlYXJDb3VudCA9IHJlc3VsdFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICdSZXF1ZXN0IEJyZWFrJykge1xuICAgICAgICAgICAgc2NvcGUuYnJlYWtDb3VudCA9IHJlc3VsdFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLy8gc2NvcGUuJGRpZ2VzdCgpXG4gICAgfSlcblxuICB9XG59XG59KVxuIiwiYXBwLmZhY3RvcnkoJ0ZlZWRiYWNrRmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXHR2YXIgRmVlZGJhY2tGYWN0b3J5ID0ge307XG5cblx0RmVlZGJhY2tGYWN0b3J5LmFkZEZlZWRiYWNrID0gZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvZmVlZGJhY2svJywge2NhdGVnb3J5OiBjYXRlZ29yeX0pXG5cdFx0LnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnZ290SEVSRScsIHJlc3VsdClcblx0XHR9KVxuXHR9XG5cblx0RmVlZGJhY2tGYWN0b3J5LmNvdW50RmVlZGJhY2sgPSBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2ZlZWRiYWNrL2NvdW50LycrIGNhdGVnb3J5KVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlc3VsdCApIHtcblx0XHRcdHJldHVybiByZXN1bHQuZGF0YVxuXHRcdH0pXG5cdH1cblxuXHRyZXR1cm4gRmVlZGJhY2tGYWN0b3J5XG59KSIsImFwcC5kaXJlY3RpdmUoJ3BvbGwnLCAoJHN0YXRlLCBQb2xsRmFjdG9yeSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIHVzZUN0cmw6IFwiQFwiXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9wb2xsL3BvbGwuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUpIHtcblxuICAgICAgc2NvcGUuZGVsZXRlID0gUG9sbEZhY3RvcnkuZGVsZXRlUG9sbFxuXG4gICAgICBQb2xsRmFjdG9yeS5nZXRBbGxCeUxlY3R1cmVJZCgxKVxuICAgICAgLnRoZW4oKGN1cnJlbnRQb2xscykgPT4ge1xuICAgICAgICBzY29wZS5wb2xscyA9IGN1cnJlbnRQb2xsc1xuICAgICAgfSlcblxuICAgICAgc2NvcGUuc2VuZFBvbGwgPSBmdW5jdGlvbihwb2xsKSB7XG4gICAgICAgIHNvY2tldC5lbWl0KCdwb2xsT3V0JywgcG9sbClcbiAgICAgIH1cblxuICAgIH1cbiAgfVxufSlcbiIsImFwcC5mYWN0b3J5KCdQb2xsRmFjdG9yeScsICgkaHR0cCkgPT4ge1xuICBmdW5jdGlvbiBkb3REYXRhKGRvdCkge1xuICAgIHJldHVybiBkb3QuZGF0YVxuICB9XG4gIHZhciBjYWNoZWRQb2xscyA9IFtdXG4gIHJldHVybiB7XG4gICAgZ2V0QWxsQnlMZWN0dXJlSWQ6IChpZCkgPT4ge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9wb2xsL2xlY3R1cmUvJytpZClcbiAgICAgIC50aGVuKGRvdERhdGEpXG4gICAgICAudGhlbigocG9sbHMpID0+IHtcbiAgICAgICAgYW5ndWxhci5jb3B5KHBvbGxzLCBjYWNoZWRQb2xscylcbiAgICAgICAgcmV0dXJuIGNhY2hlZFBvbGxzXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2V0T25lQnlQb2xsSWQ6IChpZCkgPT4ge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9wb2xsLycraWQpXG4gICAgICAudGhlbihkb3REYXRhKVxuICAgIH0sXG4gICAgY3JlYXRlUG9sbDogKHBvbGxPYmopID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3BvbGwvJywgcG9sbE9iailcbiAgICAgIC50aGVuKGRvdERhdGEpXG4gICAgfSxcbiAgICB1cGRhdGVQb2xsOiAocG9sbE9iaiwgaWQpID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvcG9sbC8nK2lkLCBwb2xsT2JqKVxuICAgICAgLnRoZW4oZG90RGF0YSlcbiAgICB9LFxuICAgIGRlbGV0ZVBvbGw6IChpZCkgPT4ge1xuICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS9wb2xsLycraWQpXG4gICAgICAudGhlbihkb3REYXRhKVxuICAgICAgLnRoZW4oKHJlbW92ZWRQb2xsKSA9PiB7XG4gICAgICAgIGNhY2hlZFBvbGxzLnNwbGljZShjYWNoZWRQb2xscy5tYXAoZnVuY3Rpb24oaXRlbSkgeyByZXR1cm4gaXRlbS5pZCB9KS5pbmRleE9mKGlkKSwxKVxuICAgICAgICByZXR1cm4gY2FjaGVkUG9sbHNcbiAgICAgIH0pXG4gICAgfVxuICB9XG59KVxuIiwiYXBwLmRpcmVjdGl2ZSgncXVlc3Rpb24nLCBmdW5jdGlvbigkc3RhdGUsIFF1ZXN0aW9uRmFjdG9yeSkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIFxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9xdWVzdGlvbi9xdWVzdGlvbi5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUpIHtcblxuICAgICAgICAgICAgUXVlc3Rpb25GYWN0b3J5LmdldEFsbEJ5TGVjdHVyZUlkKDEpLnRoZW4oZnVuY3Rpb24ocXVlc3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUucXVlc3Rpb25zID0gcXVlc3Rpb25zLmZpbHRlcihmdW5jdGlvbihxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBxLnN0YXR1cyA9PT0gJ29wZW4nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmRJbmRleChxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NvcGUucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5xdWVzdGlvbnNbaV0udGV4dCA9PT0gcXVlc3Rpb24udGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBtb3ZlKHF1ZXN0aW9uLCBuKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZmluZEluZGV4KHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIGlmIChpbmRleCtuID4gLTEgJiYgaW5kZXgrbiA8IHNjb3BlLnF1ZXN0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucXVlc3Rpb25zLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucXVlc3Rpb25zLnNwbGljZShpbmRleCtuLCAwLCBxdWVzdGlvbilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChzY29wZS5uZXdRdWVzdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSB7dGV4dDogc2NvcGUubmV3UXVlc3Rpb24sIHN1Ym1pdFRpbWU6IERhdGUubm93KCksIHVwdm90ZXM6IDB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBRdWVzdGlvbkZhY3Rvcnkuc3RvcmUocXVlc3Rpb24pLnRoZW4oZnVuY3Rpb24ocSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2FkZGluZ1F1ZXN0aW9uJywgcSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLm5ld1F1ZXN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2RlbGV0aW5nUXVlc3Rpb24nLCBxdWVzdGlvbilcbiAgICAgICAgICAgICAgICByZXR1cm4gUXVlc3Rpb25GYWN0b3J5LmRlbGV0ZShxdWVzdGlvbilcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2NvcGUuY2xvc2UgPSBmdW5jdGlvbihxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIHF1ZXN0aW9uLnN0YXR1cyA9ICdjbG9zZWQnXG4gICAgICAgICAgICAgICAgcmV0dXJuIFF1ZXN0aW9uRmFjdG9yeS51cGRhdGUocXVlc3Rpb24pLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2RlbGV0aW5nUXVlc3Rpb24nLCBxdWVzdGlvbilcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS5tb3ZlID0gZnVuY3Rpb24ocXVlc3Rpb24sIG4pIHtcbiAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnbW92ZScsIHF1ZXN0aW9uLCBuKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS51cHZvdGUgPSBmdW5jdGlvbihxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIHF1ZXN0aW9uLmhhc1Vwdm90ZWQgPSAhcXVlc3Rpb24uaGFzVXB2b3RlZDtcbiAgICAgICAgICAgICAgICBxdWVzdGlvbi51cHZvdGVzKys7XG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ3Vwdm90aW5nJywgcXVlc3Rpb24pXG4gICAgICAgICAgICAgICAgcmV0dXJuIFF1ZXN0aW9uRmFjdG9yeS51cGRhdGUocXVlc3Rpb24pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLmRvd252b3RlID0gZnVuY3Rpb24ocXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICBxdWVzdGlvbi5oYXNVcHZvdGVkID0gIXF1ZXN0aW9uLmhhc1Vwdm90ZWQ7XG4gICAgICAgICAgICAgICAgcXVlc3Rpb24udXB2b3Rlcy0tO1xuICAgICAgICAgICAgICAgIHNvY2tldC5lbWl0KCdkb3dudm90aW5nJywgcXVlc3Rpb24pXG4gICAgICAgICAgICAgICAgcmV0dXJuIFF1ZXN0aW9uRmFjdG9yeS51cGRhdGUocXVlc3Rpb24pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNvY2tldC5vbignYWRkUXVlc3Rpb24nLCBmdW5jdGlvbihxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIHNjb3BlLnF1ZXN0aW9ucy51bnNoaWZ0KHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIHNjb3BlLiRldmFsQXN5bmMoKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdkZWxldGVRdWVzdGlvbicsIGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZmluZEluZGV4KHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIHNjb3BlLnF1ZXN0aW9ucy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICAgICAgc2NvcGUuJGV2YWxBc3luYygpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBzb2NrZXQub24oJ3JlY2VpdmVkVXB2b3RlJywgZnVuY3Rpb24ocXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgocXVlc3Rpb24pXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gc2NvcGUucXVlc3Rpb25zW2luZGV4XVxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uLnVwdm90ZXMrK1xuICAgICAgICAgICAgICAgIHNjb3BlLiRldmFsQXN5bmMoKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdyZWNlaXZlZERvd252b3RlJywgZnVuY3Rpb24ocXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgocXVlc3Rpb24pXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gc2NvcGUucXVlc3Rpb25zW2luZGV4XVxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uLnVwdm90ZXMtLTtcbiAgICAgICAgICAgICAgICBzY29wZS4kZXZhbEFzeW5jKClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHNvY2tldC5vbignbW92aW5nJywgZnVuY3Rpb24ocXVlc3Rpb24sIG4pIHtcbiAgICAgICAgICAgICAgICBtb3ZlKHF1ZXN0aW9uLCBuKVxuICAgICAgICAgICAgICAgIHNjb3BlLiRldmFsQXN5bmMoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiYXBwLmZhY3RvcnkoJ1F1ZXN0aW9uRmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG5cdHZhciBvYmogPSB7fTtcblxuXHRvYmouZ2V0QWxsQnlMZWN0dXJlSWQgPSBmdW5jdGlvbihsZWN0dXJlSWQpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3F1ZXN0aW9uL2xlY3R1cmUvJyArIGxlY3R1cmVJZCkudGhlbihmdW5jdGlvbihyZXMpIHtcblx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHR9KVxuXHR9XG5cblx0b2JqLnN0b3JlID0gZnVuY3Rpb24ocXVlc3Rpb24pIHtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9xdWVzdGlvbicsIHF1ZXN0aW9uKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pXG5cdH1cblxuXHRvYmoudXBkYXRlID0gZnVuY3Rpb24ocXVlc3Rpb24pIHtcblx0XHRyZXR1cm4gJGh0dHAucHV0KCcvYXBpL3F1ZXN0aW9uLycgKyBxdWVzdGlvbi5pZCwgcXVlc3Rpb24pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSlcblx0fVxuXG5cdG9iai5kZWxldGUgPSBmdW5jdGlvbihxdWVzdGlvbikge1xuXHRcdHJldHVybiAkaHR0cC5kZWxldGUoJy9hcGkvcXVlc3Rpb24vJyArIHF1ZXN0aW9uLmlkKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pXG5cdH1cblxuXHRyZXR1cm4gb2JqO1xuXG59KTtcbiIsImFwcC5jb250cm9sbGVyKCdTdHVkZW50UG9sbCcsIGZ1bmN0aW9uKCRzY29wZSwgJHVpYk1vZGFsKSB7XG4gICRzY29wZS5zaG93TW9kYWwgPSBmdW5jdGlvbigpIHtcblxuICAgICRzY29wZS5vcHRzID0ge1xuICAgICAgYmFja2Ryb3A6IHRydWUsXG4gICAgICBiYWNrZHJvcENsaWNrOiB0cnVlLFxuICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgIGRpYWxvZ0ZhZGU6IGZhbHNlLFxuICAgICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybCA6ICdqcy9jb21tb24vc3R1ZGVudE1vZGFsL3N0dWRlbnRQb2xsLmh0bWwnLFxuICAgICAgY29udHJvbGxlciA6IFN0dWRlbnRNb2RhbEluc3RhbmNlLFxuICAgICAgcmVzb2x2ZToge30gLy8gZW1wdHkgc3RvcmFnZVxuICAgIH07XG5cbiAgICAkc2NvcGUub3B0cy5yZXNvbHZlLml0ZW0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBhbmd1bGFyLmNvcHkoe3BvbGw6JHNjb3BlLnBvbGx9KTsgLy8gcGFzcyBuYW1lIHRvIERpYWxvZ1xuICAgIH1cblxuICAgIHZhciBtb2RhbEluc3RhbmNlID0gJHVpYk1vZGFsLm9wZW4oJHNjb3BlLm9wdHMpO1xuXG4gICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbigpe1xuICAgICAgLy9vbiBvayBidXR0b24gcHJlc3NcbiAgICB9LGZ1bmN0aW9uKCl7XG4gICAgICAvL29uIGNhbmNlbCBidXR0b24gcHJlc3NcbiAgICB9KVxuICB9XG5cbiAgc29ja2V0Lm9uKCd0b1N0dWRlbnQnLCBmdW5jdGlvbihwb2xsUXVlc3Rpb24pIHtcbiAgICAkc2NvcGUucG9sbCA9IHBvbGxRdWVzdGlvblxuICAgICRzY29wZS5zaG93TW9kYWwoKVxuICB9KVxuXG59KVxuXG5mdW5jdGlvbiBTdHVkZW50TW9kYWxJbnN0YW5jZSgkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCAkdWliTW9kYWwsIGl0ZW0sIFBvbGxGYWN0b3J5KSB7XG5cbiAgJHNjb3BlLml0ZW0gPSBpdGVtO1xuXG4gIHNvY2tldC5vbigndG9TdHVkZW50JywgZnVuY3Rpb24ocG9sbFF1ZXN0aW9uKSB7XG4gICAgJHNjb3BlLnBvbGwgPSBwb2xsUXVlc3Rpb25cbiAgfSlcblxuICAkc2NvcGUuc3VibWl0QW5zd2VyID0gZnVuY3Rpb24gKCkge1xuICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKClcbiAgfVxuXG59XG4iLCJnYXBpLmhhbmdvdXQucmVuZGVyKCdzdGFydEJ1dHRvbjInLCB7XG4ncmVuZGVyJzogJ2NyZWF0ZWhhbmdvdXQnLFxuJ2hhbmdvdXRfdHlwZSc6ICdvbmFpcicsXG4naW5pdGlhbF9hcHBzJzogW1xuICAgIHsgYXBwX2lkIDogJ2VmZm9ydGxlc3MtY2l0eS0xMzU1MjMnLCBzdGFydF9kYXRhIDogJ2RRdzR3OVdnWGNRJywgJ2FwcF90eXBlJyA6ICdST09NX0FQUCcgfVxuXSxcbid3aWRnZXRfc2l6ZSc6IDcyXG59KTtcblxudmFyIHF1ZXVlID0ge1xuICAgIGNvbmZ1c2VkOiBbXSxcbiAgICBncmVhdDogW10sXG4gICAgZXhhbXBsZTogW11cbn07XG5cbnZhciBkYXRhUXVldWUgPSB7XG4gICAgY29uZnVzZWQ6IFtdLFxuICAgIGdyZWF0OiBbXSxcbiAgICBleGFtcGxlOiBbXVxufTtcblxudmFyIGRhdGFMZW5ndGg9MzA7XG52YXIgeFZhbD0gZGF0YUxlbmd0aDtcblxuZnVuY3Rpb24gc2VlZERhdGEob2JqKXtcbiAgICBmb3IgKHZhciBjYXRlZ29yeSBpbiBvYmope1xuICAgICAgICB2YXIgdGVtcEluZGV4PTA7XG4gICAgICAgIHdoaWxlIChvYmpbY2F0ZWdvcnldLmxlbmd0aDxkYXRhTGVuZ3RoKXtcbiAgICAgICAgICAgIG9ialtjYXRlZ29yeV0ucHVzaCh7eDp0ZW1wSW5kZXgsIHk6MH0pO1xuICAgICAgICAgICAgdGVtcEluZGV4Kys7XG4gICAgICAgIH1cbiAgICB9XG59XG5zZWVkRGF0YShxdWV1ZSk7XG5cbnZhciBjaGFydENvZGUgPSBuZXcgQ2FudmFzSlMuQ2hhcnQoXCJjaGFydENvZGVcIix7XG4gICAgY3JlZGl0VGV4dDogXCJcIixcbiAgICB0aXRsZSA6e1xuICAgICAgICB0ZXh0OiBcIkxpdmUgRmVlZGJhY2tcIixcbiAgICAgICAgZm9udENvbG9yOiBcIndoaXRlXCJcbiAgICB9LCAgXG4gICAgYmFja2dyb3VuZENvbG9yOiBudWxsLCAgICAgICAgXG4gICAgYXhpc1g6IHtcbiAgICAgICAgdGlja0xlbmd0aDogMCxcbiAgICAgICAgdmFsdWVGb3JtYXRTdHJpbmc6IFwiIFwiLFxuICAgICAgICBsaW5lVGhpY2tuZXNzOiAwXG4gICAgfSxcbiAgICBheGlzWToge1xuICAgICAgICBtaW5pbXVtOiAtNSxcbiAgICAgICAgbWF4aW11bTogMTAsXG4gICAgICAgIHRpY2tMZW5ndGg6IDAsXG4gICAgICAgIGdyaWRUaGlja25lc3M6IDAsXG4gICAgICAgIGxhYmVsRm9udENvbG9yOiAnd2hpdGUnLFxuICAgICAgICBsaW5lQ29sb3I6ICd3aGl0ZSdcbiAgICB9LFxuICAgIGxlZ2VuZDp7XG4gICAgICAgIHZlcnRpY2FsQWxpZ246IFwiYm90dG9tXCIsXG4gICAgICAgIGhvcml6b250YWxBbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgICBjdXJzb3I6XCJwb2ludGVyXCIsXG4gICAgICAgIGl0ZW1jbGljayA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBpZiAodHlwZW9mKGUuZGF0YVNlcmllcy52aXNpYmxlKSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBlLmRhdGFTZXJpZXMudmlzaWJsZSkge1xuICAgICAgICAgIGUuZGF0YVNlcmllcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZS5kYXRhU2VyaWVzLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaGFydFF1ZXN0aW9uLnJlbmRlcigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBkYXRhOiBbe1xuICAgICAgICBtYXJrZXJUeXBlOiAnbm9uZScsXG4gICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICB0eXBlOiBcImxpbmVcIixcbiAgICAgICAgc2hvd0luTGVnZW5kOiB0cnVlLFxuICAgICAgICBuYW1lOiBcIkNvbmZ1c2VkXCIsXG4gICAgICAgIGRhdGFQb2ludHM6IHF1ZXVlWydjb25mdXNlZCddXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG1hcmtlclR5cGU6ICdub25lJyxcbiAgICAgICAgY29sb3I6ICdyZWQnLFxuICAgICAgICB0eXBlOiBcImxpbmVcIixcbiAgICAgICAgc2hvd0luTGVnZW5kOiB0cnVlLFxuICAgICAgICBuYW1lOiBcIkV4YW1wbGVcIixcbiAgICAgICAgZGF0YVBvaW50czogcXVldWVbJ2V4YW1wbGUnXVxuICAgIH0sXG4gICAge1xuICAgICAgICBtYXJrZXJUeXBlOiAnbm9uZScsXG4gICAgICAgIGNvbG9yOiAnYmx1ZScsXG4gICAgICAgIHR5cGU6IFwibGluZVwiLFxuICAgICAgICBzaG93SW5MZWdlbmQ6IHRydWUsXG4gICAgICAgIG5hbWU6IFwiR3JlYXRcIixcbiAgICAgICAgZGF0YVBvaW50czogcXVldWVbJ2dyZWF0J11cbiAgICB9XG4gICAgXVxufSk7XG5cbnZhciB1cGRhdGVDaGFydCA9IGZ1bmN0aW9uICgpIHsgICAgXG4gICAgeFZhbCsrO1xuICAgIFxuICAgIHF1ZXVlWydjb25mdXNlZCddLnB1c2goe3g6IHhWYWwsIHk6MCtkYXRhUXVldWVbJ2NvbmZ1c2VkJ10ubGVuZ3RofSk7XG4gICAgcXVldWVbJ2V4YW1wbGUnXS5wdXNoKHt4OiB4VmFsLCB5OjArZGF0YVF1ZXVlWydleGFtcGxlJ10ubGVuZ3RofSk7XG4gICAgcXVldWVbJ2dyZWF0J10ucHVzaCh7eDogeFZhbCwgeTowK2RhdGFRdWV1ZVsnZ3JlYXQnXS5sZW5ndGh9KTtcblxuICAgIGlmIChxdWV1ZVsnY29uZnVzZWQnXS5sZW5ndGggPiBkYXRhTGVuZ3RoKSBxdWV1ZVsnY29uZnVzZWQnXS5zaGlmdCgpOyAgICAgICAgICAgICAgICBcbiAgICBpZiAocXVldWVbJ2V4YW1wbGUnXS5sZW5ndGggPiBkYXRhTGVuZ3RoKSBxdWV1ZVsnZXhhbXBsZSddLnNoaWZ0KCk7ICBcbiAgICBpZiAocXVldWVbJ2dyZWF0J10ubGVuZ3RoID4gZGF0YUxlbmd0aCkgcXVldWVbJ2dyZWF0J10uc2hpZnQoKTsgICAgICAgICAgICAgICAgXG5cbiAgICBjaGFydENvZGUucmVuZGVyKCk7ICBcblxuICAgIGRhdGFRdWV1ZVsnY29uZnVzZWQnXT1bXTtcbiAgICBkYXRhUXVldWVbJ2V4YW1wbGUnXT1bXTtcbiAgICBkYXRhUXVldWVbJ2dyZWF0J109W107XG5cbn07XG5cbmZ1bmN0aW9uIHVwZGF0ZUluc3RydWN0b3JWaWV3KCl7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgdXBkYXRlQ2hhcnQoKTtcbiAgICB9LCAxMDAwKTsgXG59O1xuXG51cGRhdGVJbnN0cnVjdG9yVmlldygpO1xuXG5zb2NrZXQub24oJ3VwZGF0ZUZlZWRiYWNrJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgY29uc29sZS5sb2coXCJBcHAgcmVjZWl2ZWQgYmFjazogXCIsZGF0YSk7XG4gIGRhdGEgPSBkYXRhLnRvTG93ZXJDYXNlKCk7XG4gIGRhdGFRdWV1ZVtkYXRhXS5wdXNoKFwiaW5zdGFuY2VcIik7XG59KTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cblxuICAgIC8vICQoJy5zdGFydCcpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIGlmICgkKHRoaXMpLmh0bWwoKT09J1N0YXJ0Jykge1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJ0cmlnZ2VyIHN0YXJ0XCIpO1xuICAgIC8vICAgICAgICAgJC5wb3N0KCcvYWRkRmVlZGJhY2snLHttZXNzYWdlOlwic3RhcnRcIiwgdGltZTogTWF0aC5mbG9vcihEYXRlLm5vdygpLzEwMDApfSk7XG4gICAgLy8gICAgICAgICAkKHRoaXMpLmh0bWwoJ1N0b3AnKTtcbiAgICAvLyAgICAgICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJ3JlZCcpO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGVsc2Uge1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJ0cmlnZ2VyIHN0b3BcIik7XG4gICAgLy8gICAgICAgICAkLnBvc3QoJy9hZGRGZWVkYmFjaycse21lc3NhZ2U6XCJzdG9wXCIsIHRpbWU6IE1hdGguZmxvb3IoRGF0ZS5ub3coKS8xMDAwKX0pO1xuICAgIC8vICAgICAgICAgJCh0aGlzKS5odG1sKCdTdGFydCcpO1xuICAgIC8vICAgICAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnZ3JlZW4nKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH0pXG5cbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
>>>>>>> master
