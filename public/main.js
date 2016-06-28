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
app.directive('feedback', function ($state, FeedbackFactory) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/feedback/feedback.html',
    link: function link(scope) {
      scope.addMessage = false;
      scope.rejectMessage = false;

      scope.countFeedback = function (category) {
        if (category === 'Great' && !scope.greatCount || category === 'Confused' && !scope.confusedCount || category === 'Example' && !scope.exampleCount || category === 'Cannot See' && !scope.seeCount || category === 'Cannot Hear' && !scope.hearCount || category === 'Request Break' && !scope.breakCount) {
          return FeedbackFactory.addFeedback(category).then(function () {
            return FeedbackFactory.countFeedback(category);
          }).then(function (result) {
            socket.emit('submittedFeedback', category);

            console.log('IT IS HERE', result);
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
          }).then(function () {
            scope.addMessage = true;
            setTimeout(function () {
              scope.addMessage = false;
              scope.$digest();
            }, 1500);
          }).then(function () {
            setTimeout(function () {
              scope.greatCount = null;
              scope.confusedCount = null;
              scope.exampleCount = null;
              scope.seeCount = null;
              scope.hearCount = null;
              scope.breakCount = null;
              scope.$digest();
            }, 30 * 1000);
          });
        } else {
          scope.rejectMessage = true;
          setTimeout(function () {
            scope.rejectMessage = false;
            scope.$digest();
          }, 1500);
        }
      };

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
        }).then(function () {
          setTimeout(function () {
            scope.greatCount = null;
            scope.confusedCount = null;
            scope.exampleCount = null;
            scope.seeCount = null;
            scope.hearCount = null;
            scope.breakCount = null;
            scope.$digest();
          }, 30 * 1000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInNvY2tldC5qcyIsImNvbW1vbi9mZWVkYmFjay9mZWVkYmFjay5kaXJlY3RpdmUuanMiLCJjb21tb24vZmVlZGJhY2svZmVlZGJhY2suZmFjdG9yeS5qcyIsImNvbW1vbi9jcmVhdGVQb2xsTW9kYWwvY3JlYXRlUG9sbC5jb250cm9sbGVyLmpzIiwiY29tbW9uL2xpdmVQb2xsL2FjdGl2ZVBvbGwuZGlyZWN0aXZlLmpzIiwiY29tbW9uL3BvbGwvcG9sbC5kaXJlY3RpdmUuanMiLCJjb21tb24vcG9sbC9wb2xsLmZhY3RvcnkuanMiLCJjb21tb24vcG9sbC9wb2xsQW5zd2VyLmZhY3RvcnkuanMiLCJjb21tb24vcXVlc3Rpb24vcXVlc3Rpb24uZGlyZWN0aXZlLmpzIiwiY29tbW9uL3F1ZXN0aW9uL3F1ZXN0aW9uLmZhY3RvcnkuanMiLCJjb21tb24vc3R1ZGVudE1vZGFsL3N0dWRlbnRQb2xsLmNvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsT0FBQSxHQUFBLEdBQUEsUUFBQSxNQUFBLENBQUEsT0FBQSxFQUFBLENBQUEsV0FBQSxFQUFBLGNBQUEsRUFBQSxXQUFBLEVBQUEsV0FBQSxDQUFBLENBQUE7O0FBRUEsSUFBQSxNQUFBLENBQUEsVUFBQSxrQkFBQSxFQUFBLGlCQUFBLEVBQUEsZ0JBQUEsRUFBQTs7QUFFQSxvQkFBQSxTQUFBLENBQUEsSUFBQTs7QUFFQSxxQkFBQSxTQUFBLENBQUEsR0FBQTs7QUFFQSxxQkFBQSxJQUFBLENBQUEsaUJBQUEsRUFBQSxZQUFBO0FBQ0EsV0FBQSxRQUFBLENBQUEsTUFBQTtBQUNBLEdBRkE7O0FBSUEsbUJBQUEsTUFBQSxDQUFBLElBQUEsR0FBQSxJQUFBO0FBRUEsQ0FaQTs7QUFjQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGlCQUFBLEtBQUEsQ0FBQSxTQUFBLEVBQUE7QUFDQSxTQUFBLFVBREE7QUFFQSxpQkFBQTtBQUZBLEdBQUE7QUFJQSxDQUxBOztBQU9BLElBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBO0FBQ0EsaUJBQUEsS0FBQSxDQUFBLE9BQUEsRUFBQTtBQUNBLFNBQUEsUUFEQTtBQUVBLGlCQUFBO0FBRkEsR0FBQTtBQUlBLENBTEE7O0FBT0EsSUFBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxpQkFBQSxLQUFBLENBQUEsU0FBQSxFQUFBO0FBQ0EsU0FBQSxVQURBO0FBRUEsaUJBQUE7QUFGQSxHQUFBO0FBSUEsQ0FMQTs7QUFPQSxJQUFBLFVBQUEsQ0FBQSxXQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBOztBQUVBLFVBQUEsR0FBQSxDQUFBLG9CQUFBO0FBQ0EsU0FBQSxXQUFBLEdBQUEsWUFBQTtBQUNBLFlBQUEsR0FBQSxDQUFBLHNCQUFBO0FBQ0EsUUFBQSxPQUFBLE9BQUEsS0FBQTtBQUNBLFlBQUEsR0FBQSxDQUFBLFFBQUEsRUFBQSxJQUFBOztBQUVBLFFBQUEsU0FBQSxPQUFBLEVBQUE7QUFDQSxhQUFBLEVBQUEsQ0FBQSxPQUFBO0FBQ0EsS0FGQSxNQUdBLElBQUEsU0FBQSxTQUFBLEVBQUE7QUFDQSxhQUFBLEVBQUEsQ0FBQSxTQUFBO0FBQ0EsS0FGQSxNQUdBLElBQUEsU0FBQSxTQUFBLEVBQUE7QUFDQSxhQUFBLEVBQUEsQ0FBQSxTQUFBO0FBQ0E7QUFDQSxHQWRBO0FBZ0JBLENBbkJBOztBQ3ZDQSxJQUFBLFNBQUEsR0FBQSxPQUFBLFFBQUEsQ0FBQSxNQUFBLENBQUE7QUNBQSxJQUFBLFNBQUEsQ0FBQSxVQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsZUFBQSxFQUFBO0FBQ0EsU0FBQTtBQUNBLGNBQUEsR0FEQTtBQUVBLFdBQUEsRUFGQTtBQUtBLGlCQUFBLGtDQUxBO0FBTUEsVUFBQSxjQUFBLEtBQUEsRUFBQTtBQUNBLFlBQUEsVUFBQSxHQUFBLEtBQUE7QUFDQSxZQUFBLGFBQUEsR0FBQSxLQUFBOztBQUVBLFlBQUEsYUFBQSxHQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsWUFBQSxhQUFBLE9BQUEsSUFBQSxDQUFBLE1BQUEsVUFBQSxJQUFBLGFBQUEsVUFBQSxJQUFBLENBQUEsTUFBQSxhQUFBLElBQUEsYUFBQSxTQUFBLElBQUEsQ0FBQSxNQUFBLFlBQUEsSUFBQSxhQUFBLFlBQUEsSUFBQSxDQUFBLE1BQUEsUUFBQSxJQUFBLGFBQUEsYUFBQSxJQUFBLENBQUEsTUFBQSxTQUFBLElBQUEsYUFBQSxlQUFBLElBQUEsQ0FBQSxNQUFBLFVBQUEsRUFBQTtBQUNBLGlCQUFBLGdCQUFBLFdBQUEsQ0FBQSxRQUFBLEVBQ0EsSUFEQSxDQUNBLFlBQUE7QUFDQSxtQkFBQSxnQkFBQSxhQUFBLENBQUEsUUFBQSxDQUFBO0FBQ0EsV0FIQSxFQUlBLElBSkEsQ0FJQSxVQUFBLE1BQUEsRUFBQTtBQUNBLG1CQUFBLElBQUEsQ0FBQSxtQkFBQSxFQUFBLFFBQUE7O0FBRUEsb0JBQUEsR0FBQSxDQUFBLFlBQUEsRUFBQSxNQUFBO0FBQ0EsZ0JBQUEsYUFBQSxPQUFBLEVBQUE7QUFDQSxvQkFBQSxVQUFBLEdBQUEsTUFBQTtBQUNBO0FBQ0EsZ0JBQUEsYUFBQSxVQUFBLEVBQUE7QUFDQSxvQkFBQSxhQUFBLEdBQUEsTUFBQTtBQUNBO0FBQ0EsZ0JBQUEsYUFBQSxTQUFBLEVBQUE7QUFDQSxvQkFBQSxZQUFBLEdBQUEsTUFBQTtBQUNBO0FBQ0EsZ0JBQUEsYUFBQSxZQUFBLEVBQUE7QUFDQSxvQkFBQSxRQUFBLEdBQUEsTUFBQTtBQUNBO0FBQ0EsZ0JBQUEsYUFBQSxhQUFBLEVBQUE7QUFDQSxvQkFBQSxTQUFBLEdBQUEsTUFBQTtBQUNBO0FBQ0EsZ0JBQUEsYUFBQSxlQUFBLEVBQUE7QUFDQSxvQkFBQSxVQUFBLEdBQUEsTUFBQTtBQUNBO0FBQ0EsV0ExQkEsRUEyQkEsSUEzQkEsQ0EyQkEsWUFBQTtBQUNBLGtCQUFBLFVBQUEsR0FBQSxJQUFBO0FBQ0EsdUJBQUEsWUFBQTtBQUNBLG9CQUFBLFVBQUEsR0FBQSxLQUFBO0FBQ0Esb0JBQUEsT0FBQTtBQUNBLGFBSEEsRUFHQSxJQUhBO0FBSUEsV0FqQ0EsRUFrQ0EsSUFsQ0EsQ0FrQ0EsWUFBQTtBQUNBLHVCQUFBLFlBQUE7QUFDQSxvQkFBQSxVQUFBLEdBQUEsSUFBQTtBQUNBLG9CQUFBLGFBQUEsR0FBQSxJQUFBO0FBQ0Esb0JBQUEsWUFBQSxHQUFBLElBQUE7QUFDQSxvQkFBQSxRQUFBLEdBQUEsSUFBQTtBQUNBLG9CQUFBLFNBQUEsR0FBQSxJQUFBO0FBQ0Esb0JBQUEsVUFBQSxHQUFBLElBQUE7QUFDQSxvQkFBQSxPQUFBO0FBQ0EsYUFSQSxFQVFBLEtBQUEsSUFSQTtBQVNBLFdBNUNBLENBQUE7QUE2Q0EsU0E5Q0EsTUFnREE7QUFDQSxnQkFBQSxhQUFBLEdBQUEsSUFBQTtBQUNBLHFCQUFBLFlBQUE7QUFDQSxrQkFBQSxhQUFBLEdBQUEsS0FBQTtBQUNBLGtCQUFBLE9BQUE7QUFDQSxXQUhBLEVBR0EsSUFIQTtBQUlBO0FBQ0EsT0F4REE7O0FBMERBLGFBQUEsRUFBQSxDQUFBLGdCQUFBLEVBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxnQkFBQSxHQUFBLENBQUEsY0FBQSxFQUFBLFFBQUE7O0FBRUEsZUFBQSxnQkFBQSxhQUFBLENBQUEsUUFBQSxFQUNBLElBREEsQ0FDQSxVQUFBLE1BQUEsRUFBQTtBQUNBLGNBQUEsYUFBQSxPQUFBLEVBQUE7QUFDQSxrQkFBQSxVQUFBLEdBQUEsTUFBQTtBQUNBO0FBQ0EsY0FBQSxhQUFBLFVBQUEsRUFBQTtBQUNBLGtCQUFBLGFBQUEsR0FBQSxNQUFBO0FBQ0E7QUFDQSxjQUFBLGFBQUEsU0FBQSxFQUFBO0FBQ0Esa0JBQUEsWUFBQSxHQUFBLE1BQUE7QUFDQTtBQUNBLGNBQUEsYUFBQSxZQUFBLEVBQUE7QUFDQSxrQkFBQSxRQUFBLEdBQUEsTUFBQTtBQUNBO0FBQ0EsY0FBQSxhQUFBLGFBQUEsRUFBQTtBQUNBLGtCQUFBLFNBQUEsR0FBQSxNQUFBO0FBQ0E7QUFDQSxjQUFBLGFBQUEsZUFBQSxFQUFBO0FBQ0Esa0JBQUEsVUFBQSxHQUFBLE1BQUE7QUFDQTtBQUNBLFNBcEJBLEVBcUJBLElBckJBLENBcUJBLFlBQUE7QUFDQSxxQkFBQSxZQUFBO0FBQ0Esa0JBQUEsVUFBQSxHQUFBLElBQUE7QUFDQSxrQkFBQSxhQUFBLEdBQUEsSUFBQTtBQUNBLGtCQUFBLFlBQUEsR0FBQSxJQUFBO0FBQ0Esa0JBQUEsUUFBQSxHQUFBLElBQUE7QUFDQSxrQkFBQSxTQUFBLEdBQUEsSUFBQTtBQUNBLGtCQUFBLFVBQUEsR0FBQSxJQUFBO0FBQ0Esa0JBQUEsT0FBQTtBQUNBLFdBUkEsRUFRQSxLQUFBLElBUkE7QUFTQSxTQS9CQSxDQUFBOztBQWlDQSxPQXBDQTtBQXNDQTtBQTFHQSxHQUFBO0FBNEdBLENBN0dBOztBQ0FBLElBQUEsT0FBQSxDQUFBLGlCQUFBLEVBQUEsVUFBQSxLQUFBLEVBQUE7QUFDQSxNQUFBLGtCQUFBLEVBQUE7O0FBRUEsa0JBQUEsV0FBQSxHQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsV0FBQSxNQUFBLElBQUEsQ0FBQSxnQkFBQSxFQUFBLEVBQUEsVUFBQSxRQUFBLEVBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxNQUFBLEVBQUE7QUFDQSxjQUFBLEdBQUEsQ0FBQSxTQUFBLEVBQUEsTUFBQTtBQUNBLEtBSEEsQ0FBQTtBQUlBLEdBTEE7O0FBT0Esa0JBQUEsYUFBQSxHQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsV0FBQSxNQUFBLEdBQUEsQ0FBQSx5QkFBQSxRQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsTUFBQSxFQUFBO0FBQ0EsYUFBQSxPQUFBLElBQUE7QUFDQSxLQUhBLENBQUE7QUFJQSxHQUxBOztBQU9BLFNBQUEsZUFBQTtBQUNBLENBbEJBO0FDQUEsSUFBQSxVQUFBLENBQUEsWUFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLFNBQUEsRUFBQTs7QUFFQSxTQUFBLFNBQUEsR0FBQSxZQUFBOztBQUVBLFdBQUEsSUFBQSxHQUFBO0FBQ0EsZ0JBQUEsSUFEQTtBQUVBLHFCQUFBLElBRkE7QUFHQSxrQkFBQSxJQUhBO0FBSUEsa0JBQUEsS0FKQTtBQUtBLGdCQUFBLElBTEE7QUFNQSxtQkFBQSxnREFOQTtBQU9BLGtCQUFBLGlCQVBBO0FBUUEsZUFBQSxFO0FBUkEsS0FBQTs7QUFXQSxXQUFBLElBQUEsQ0FBQSxPQUFBLENBQUEsSUFBQSxHQUFBLFlBQUE7QUFDQSxhQUFBLFFBQUEsSUFBQSxDQUFBLEVBQUEsT0FBQSxPQUFBLEtBQUEsRUFBQSxDQUFBLEM7QUFDQSxLQUZBOztBQUlBLFFBQUEsZ0JBQUEsVUFBQSxJQUFBLENBQUEsT0FBQSxJQUFBLENBQUE7O0FBRUEsa0JBQUEsTUFBQSxDQUFBLElBQUEsQ0FBQSxZQUFBOztBQUVBLEtBRkEsRUFFQSxZQUFBOztBQUVBLEtBSkE7QUFLQSxHQXhCQTtBQTBCQSxDQTVCQTs7QUE4QkEsSUFBQSxvQkFBQSxTQUFBLGlCQUFBLENBQUEsTUFBQSxFQUFBLGlCQUFBLEVBQUEsU0FBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUE7O0FBRUEsU0FBQSxJQUFBLEdBQUEsSUFBQTs7Ozs7O0FBTUEsU0FBQSxVQUFBLEdBQUEsWUFBQTtBQUNBLFFBQUEsT0FBQSxFQUFBO0FBQ0EsU0FBQSxRQUFBLEdBQUEsT0FBQSxPQUFBO0FBQ0EsU0FBQSxTQUFBLEdBQUEsQ0FBQTs7QUFFQSxTQUFBLE9BQUEsR0FBQSxDQUFBLE9BQUEsQ0FBQSxFQUFBLE9BQUEsQ0FBQSxFQUFBLE9BQUEsQ0FBQSxDQUFBO0FBQ0EsUUFBQSxRQUFBLEtBQUEsT0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLElBQUEsRUFBQSxJQUFBLEVBQUE7QUFBQSxhQUFBLFNBQUEsUUFBQSxTQUFBLElBQUEsUUFBQSxJQUFBLENBQUE7QUFBQSxLQUFBLEVBQUEsSUFBQSxDQUFBO0FBQ0EsUUFBQSxLQUFBLEVBQUE7QUFDQSxrQkFBQSxVQUFBLENBQUEsSUFBQSxFQUNBLElBREEsQ0FDQSxZQUFBO0FBQUEsZUFBQSxZQUFBLGlCQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUEsT0FEQSxFQUVBLElBRkEsQ0FFQSxVQUFBLEtBQUEsRUFBQTtBQUFBLGVBQUEsS0FBQSxHQUFBLEtBQUE7QUFBQSxP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QUFBLEVBQUE7O0FBRUEsU0FBQTtBQUNBLGNBQUEsR0FEQTtBQUVBLFdBQUEsRUFGQTtBQUtBLGlCQUFBLGtDQUxBO0FBTUEsVUFBQSxjQUFBLEtBQUEsRUFBQTs7QUFFQSxzQkFBQSxpQkFBQSxDQUFBLENBQUEsRUFBQSxJQUFBLENBQUEsVUFBQSxTQUFBLEVBQUE7QUFDQSxjQUFBLFNBQUEsR0FBQSxVQUFBLE1BQUEsQ0FBQSxVQUFBLENBQUEsRUFBQTtBQUNBLGlCQUFBLEVBQUEsTUFBQSxLQUFBLE1BQUE7QUFDQSxTQUZBLENBQUE7QUFHQSxPQUpBOztBQU1BLGVBQUEsU0FBQSxDQUFBLFFBQUEsRUFBQTtBQUNBLGFBQUEsSUFBQSxJQUFBLENBQUEsRUFBQSxJQUFBLE1BQUEsU0FBQSxDQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUE7QUFDQSxjQUFBLE1BQUEsU0FBQSxDQUFBLENBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxJQUFBLEVBQUE7QUFDQSxtQkFBQSxDQUFBO0FBQ0E7QUFDQTtBQUNBLGVBQUEsQ0FBQSxDQUFBO0FBQ0E7O0FBRUEsZUFBQSxJQUFBLENBQUEsUUFBQSxFQUFBLENBQUEsRUFBQTtBQUNBLFlBQUEsUUFBQSxVQUFBLFFBQUEsQ0FBQTtBQUNBLFlBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLElBQUEsUUFBQSxDQUFBLEdBQUEsTUFBQSxTQUFBLENBQUEsTUFBQSxFQUFBO0FBQ0EsZ0JBQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxLQUFBLEVBQUEsQ0FBQTtBQUNBLGdCQUFBLFNBQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLFFBQUE7QUFDQTtBQUNBOztBQUVBLFlBQUEsTUFBQSxHQUFBLFlBQUE7QUFDQSxZQUFBLE1BQUEsV0FBQSxFQUFBO0FBQ0EsY0FBQSxXQUFBLEVBQUEsTUFBQSxNQUFBLFdBQUEsRUFBQSxZQUFBLEtBQUEsR0FBQSxFQUFBLEVBQUEsU0FBQSxDQUFBLEVBQUE7QUFDQSxpQkFBQSxnQkFBQSxLQUFBLENBQUEsUUFBQSxFQUFBLElBQUEsQ0FBQSxVQUFBLENBQUEsRUFBQTtBQUNBLG1CQUFBLElBQUEsQ0FBQSxnQkFBQSxFQUFBLENBQUE7QUFDQSxrQkFBQSxXQUFBLEdBQUEsSUFBQTtBQUNBLFdBSEEsQ0FBQTtBQUlBO0FBQ0EsT0FSQTs7QUFVQSxZQUFBLE1BQUEsR0FBQSxVQUFBLFFBQUEsRUFBQTtBQUNBLGVBQUEsSUFBQSxDQUFBLGtCQUFBLEVBQUEsUUFBQTtBQUNBLGVBQUEsZ0JBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQTtBQUNBLE9BSEE7O0FBS0EsWUFBQSxLQUFBLEdBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxpQkFBQSxNQUFBLEdBQUEsUUFBQTtBQUNBLGVBQUEsZ0JBQUEsTUFBQSxDQUFBLFFBQUEsRUFBQSxJQUFBLENBQUEsWUFBQTtBQUNBLGlCQUFBLElBQUEsQ0FBQSxrQkFBQSxFQUFBLFFBQUE7QUFDQSxTQUZBLENBQUE7QUFHQSxPQUxBOztBQU9BLFlBQUEsSUFBQSxHQUFBLFVBQUEsUUFBQSxFQUFBLENBQUEsRUFBQTtBQUNBLGVBQUEsSUFBQSxDQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUEsQ0FBQTtBQUNBLE9BRkE7O0FBSUEsWUFBQSxNQUFBLEdBQUEsVUFBQSxRQUFBLEVBQUE7QUFDQSxpQkFBQSxVQUFBLEdBQUEsQ0FBQSxTQUFBLFVBQUE7QUFDQSxpQkFBQSxPQUFBO0FBQ0EsZUFBQSxJQUFBLENBQUEsVUFBQSxFQUFBLFFBQUE7QUFDQSxlQUFBLGdCQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUE7QUFDQSxPQUxBOztBQU9BLFlBQUEsUUFBQSxHQUFBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsaUJBQUEsVUFBQSxHQUFBLENBQUEsU0FBQSxVQUFBO0FBQ0EsaUJBQUEsT0FBQTtBQUNBLGVBQUEsSUFBQSxDQUFBLFlBQUEsRUFBQSxRQUFBO0FBQ0EsZUFBQSxnQkFBQSxNQUFBLENBQUEsUUFBQSxDQUFBO0FBQ0EsT0FMQTs7QUFPQSxhQUFBLEVBQUEsQ0FBQSxhQUFBLEVBQUEsVUFBQSxRQUFBLEVBQUE7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O0FBRUEsS0FGQSxFQUVBLFlBQUE7O0FBRUEsS0FKQTtBQUtBLEdBeEJBOztBQTBCQSxTQUFBLEVBQUEsQ0FBQSxXQUFBLEVBQUEsVUFBQSxZQUFBLEVBQUE7QUFDQSxXQUFBLElBQUEsR0FBQSxZQUFBO0FBQ0EsV0FBQSxTQUFBO0FBQ0EsR0FIQTtBQUtBLENBaENBOztBQWtDQSxTQUFBLG9CQUFBLENBQUEsTUFBQSxFQUFBLGlCQUFBLEVBQUEsU0FBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsaUJBQUEsRUFBQTs7QUFFQSxTQUFBLElBQUEsR0FBQSxJQUFBOztBQUVBLFNBQUEsWUFBQSxHQUFBLFlBQUE7QUFDQSxRQUFBLFNBQUE7QUFDQSxjQUFBLE9BQUEsSUFBQSxDQUFBLElBQUEsQ0FBQSxFQURBO0FBRUEsY0FBQSxPQUFBO0FBRkEsS0FBQTs7QUFLQSxzQkFBQSxVQUFBLENBQUEsTUFBQSxFQUNBLElBREEsQ0FDQSxZQUFBO0FBQ0EsYUFBQSxJQUFBLENBQUEsZUFBQTtBQUNBLHdCQUFBLEtBQUE7QUFDQSxLQUpBO0FBS0EsR0FYQTtBQWFBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbndpbmRvdy5hcHAgPSBhbmd1bGFyLm1vZHVsZSgnTXlBcHAnLCBbJ3VpLnJvdXRlcicsICd1aS5ib290c3RyYXAnLCAnbmdBbmltYXRlJywgJ25nS29va2llcyddKTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJGtvb2tpZXNQcm92aWRlcikge1xuICAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgLy8gSWYgd2UgZ28gdG8gYSBVUkwgdGhhdCB1aS1yb3V0ZXIgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQsIGdvIHRvIHRoZSBcIi9cIiB1cmwuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuICAgIC8vIFRyaWdnZXIgcGFnZSByZWZyZXNoIHdoZW4gYWNjZXNzaW5nIGFuIE9BdXRoIHJvdXRlXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJy9hdXRoLzpwcm92aWRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xuXG4gICAgJGtvb2tpZXNQcm92aWRlci5jb25maWcuanNvbiA9IHRydWU7XG5cbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzdHVkZW50Jywge1xuICAgICAgICB1cmw6ICcvc3R1ZGVudCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdmlld3Mvc3R1ZGVudC9zdHVkZW50Lmh0bWwnLFxuICAgIH0pO1xufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FkbWluJywge1xuICAgICAgICB1cmw6ICcvYWRtaW4nLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3ZpZXdzL2luc3RydWN0b3IvaW5zdHJ1Y3Rvci5odG1sJyxcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzdW1tYXJ5Jywge1xuICAgICAgICB1cmw6ICcvc3VtbWFyeScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdmlld3Mvc3VtbWFyeS9zdW1tYXJ5Lmh0bWwnLFxuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUpIHtcblxuXHRjb25zb2xlLmxvZyhcInJlYWNoZWQgbG9naW4gY3RybFwiKTtcblx0JHNjb3BlLmxvZ2luU3RhdHVzID0gZnVuY3Rpb24oKXtcblx0XHRjb25zb2xlLmxvZyhcInJlYWNoZWQgbG9naW4gc3RhdHVzXCIpO1xuXHRcdHZhciB0ZW1wID0gJHNjb3BlLmxvZ2luO1xuXHRcdGNvbnNvbGUubG9nKFwidGVtcDogXCIsdGVtcCk7XG5cblx0XHRpZiAodGVtcD09PSdhZG1pbicpe1xuXHRcdFx0JHN0YXRlLmdvKCdhZG1pbicpO1xuXHRcdH1cblx0XHRlbHNlIGlmICh0ZW1wPT09J3N0dWRlbnQnKXtcblx0XHRcdCRzdGF0ZS5nbygnc3R1ZGVudCcpO1xuXHRcdH1cbiAgICAgICAgZWxzZSBpZiAodGVtcD09PSdzdW1tYXJ5Jyl7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ3N1bW1hcnknKTtcbiAgICAgICAgfVxuXHR9XG5cbn0pO1xuIiwidmFyIHNvY2tldCA9IGlvKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pOyIsImFwcC5kaXJlY3RpdmUoJ2ZlZWRiYWNrJywgKCRzdGF0ZSwgRmVlZGJhY2tGYWN0b3J5KSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZToge1xuXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9mZWVkYmFjay9mZWVkYmFjay5odG1sJyxcbiAgICBsaW5rOiAoc2NvcGUpID0+IHtcbiAgICAgIHNjb3BlLmFkZE1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgIHNjb3BlLnJlamVjdE1lc3NhZ2UgPSBmYWxzZTtcblxuICAgICAgc2NvcGUuY291bnRGZWVkYmFjayA9IGZ1bmN0aW9uIChjYXRlZ29yeSkge1xuICAgICAgICBpZiAoKGNhdGVnb3J5ID09PSAnR3JlYXQnICYmICFzY29wZS5ncmVhdENvdW50KSB8fCAoY2F0ZWdvcnkgPT09ICdDb25mdXNlZCcgJiYgIXNjb3BlLmNvbmZ1c2VkQ291bnQpIHx8IChjYXRlZ29yeSA9PT0gJ0V4YW1wbGUnICYmICFzY29wZS5leGFtcGxlQ291bnQpIHx8IChjYXRlZ29yeSA9PT0gJ0Nhbm5vdCBTZWUnICYmICFzY29wZS5zZWVDb3VudCkgfHwgKGNhdGVnb3J5ID09PSAnQ2Fubm90IEhlYXInICYmICFzY29wZS5oZWFyQ291bnQpIHx8IChjYXRlZ29yeSA9PT0gJ1JlcXVlc3QgQnJlYWsnICYmICFzY29wZS5icmVha0NvdW50KSkge1xuICAgICAgICByZXR1cm4gRmVlZGJhY2tGYWN0b3J5LmFkZEZlZWRiYWNrKGNhdGVnb3J5KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIEZlZWRiYWNrRmFjdG9yeS5jb3VudEZlZWRiYWNrKGNhdGVnb3J5KVxuICAgICAgICB9KSBcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIHNvY2tldC5lbWl0KCdzdWJtaXR0ZWRGZWVkYmFjaycsIGNhdGVnb3J5KVxuICAgICAgICAgIFxuICAgICAgICAgIGNvbnNvbGUubG9nKCdJVCBJUyBIRVJFJywgcmVzdWx0KVxuICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ0dyZWF0Jykge1xuICAgICAgICAgICAgc2NvcGUuZ3JlYXRDb3VudCA9IHJlc3VsdFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICdDb25mdXNlZCcpIHtcbiAgICAgICAgICAgIHNjb3BlLmNvbmZ1c2VkQ291bnQgPSByZXN1bHRcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAnRXhhbXBsZScpIHtcbiAgICAgICAgICAgIHNjb3BlLmV4YW1wbGVDb3VudCA9IHJlc3VsdFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICdDYW5ub3QgU2VlJykge1xuICAgICAgICAgICAgc2NvcGUuc2VlQ291bnQgPSByZXN1bHRcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAnQ2Fubm90IEhlYXInKSB7XG4gICAgICAgICAgICBzY29wZS5oZWFyQ291bnQgPSByZXN1bHRcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAnUmVxdWVzdCBCcmVhaycpIHtcbiAgICAgICAgICAgIHNjb3BlLmJyZWFrQ291bnQgPSByZXN1bHRcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzY29wZS5hZGRNZXNzYWdlID0gdHJ1ZVxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHNjb3BlLmFkZE1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICB9LCAxNTAwKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzY29wZS5ncmVhdENvdW50ID0gbnVsbDtcbiAgICAgICAgICAgIHNjb3BlLmNvbmZ1c2VkQ291bnQgPSBudWxsO1xuICAgICAgICAgICAgc2NvcGUuZXhhbXBsZUNvdW50ID0gbnVsbDtcbiAgICAgICAgICAgIHNjb3BlLnNlZUNvdW50ID0gbnVsbDtcbiAgICAgICAgICAgIHNjb3BlLmhlYXJDb3VudCA9IG51bGw7XG4gICAgICAgICAgICBzY29wZS5icmVha0NvdW50ID0gbnVsbDtcbiAgICAgICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICB9LCAzMCoxMDAwKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBlbHNlIHtcbiAgICAgICAgc2NvcGUucmVqZWN0TWVzc2FnZSA9IHRydWVcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgIHNjb3BlLnJlamVjdE1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgICAgICBzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgIH0sIDE1MDApOyAgICAgICAgXG4gICAgICB9XG4gICAgfVxuXG4gICAgc29ja2V0Lm9uKCd1cGRhdGVGZWVkYmFjaycsIGZ1bmN0aW9uKGNhdGVnb3J5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWNlaXZlZCAtLT4nLCBjYXRlZ29yeSlcblxuICAgICAgICByZXR1cm4gRmVlZGJhY2tGYWN0b3J5LmNvdW50RmVlZGJhY2soY2F0ZWdvcnkpIFxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7ICAgICAgICAgIFxuICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ0dyZWF0Jykge1xuICAgICAgICAgICAgc2NvcGUuZ3JlYXRDb3VudCA9IHJlc3VsdFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICdDb25mdXNlZCcpIHtcbiAgICAgICAgICAgIHNjb3BlLmNvbmZ1c2VkQ291bnQgPSByZXN1bHRcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAnRXhhbXBsZScpIHtcbiAgICAgICAgICAgIHNjb3BlLmV4YW1wbGVDb3VudCA9IHJlc3VsdFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICdDYW5ub3QgU2VlJykge1xuICAgICAgICAgICAgc2NvcGUuc2VlQ291bnQgPSByZXN1bHRcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAnQ2Fubm90IEhlYXInKSB7XG4gICAgICAgICAgICBzY29wZS5oZWFyQ291bnQgPSByZXN1bHRcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAnUmVxdWVzdCBCcmVhaycpIHtcbiAgICAgICAgICAgIHNjb3BlLmJyZWFrQ291bnQgPSByZXN1bHRcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2NvcGUuZ3JlYXRDb3VudCA9IG51bGw7XG4gICAgICAgICAgICBzY29wZS5jb25mdXNlZENvdW50ID0gbnVsbDtcbiAgICAgICAgICAgIHNjb3BlLmV4YW1wbGVDb3VudCA9IG51bGw7XG4gICAgICAgICAgICBzY29wZS5zZWVDb3VudCA9IG51bGw7XG4gICAgICAgICAgICBzY29wZS5oZWFyQ291bnQgPSBudWxsO1xuICAgICAgICAgICAgc2NvcGUuYnJlYWtDb3VudCA9IG51bGw7XG4gICAgICAgICAgICBzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgICAgfSwgMzAqMTAwMClcbiAgICAgICAgfSlcbiAgICAgICAgLy8gc2NvcGUuJGRpZ2VzdCgpXG4gICAgfSlcblxuICB9XG59XG59KVxuIiwiYXBwLmZhY3RvcnkoJ0ZlZWRiYWNrRmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXHR2YXIgRmVlZGJhY2tGYWN0b3J5ID0ge307XG5cblx0RmVlZGJhY2tGYWN0b3J5LmFkZEZlZWRiYWNrID0gZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvZmVlZGJhY2svJywge2NhdGVnb3J5OiBjYXRlZ29yeX0pXG5cdFx0LnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG5cdFx0XHRjb25zb2xlLmxvZygnZ290SEVSRScsIHJlc3VsdClcblx0XHR9KVxuXHR9XG5cblx0RmVlZGJhY2tGYWN0b3J5LmNvdW50RmVlZGJhY2sgPSBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2ZlZWRiYWNrL2NvdW50LycrIGNhdGVnb3J5KVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlc3VsdCApIHtcblx0XHRcdHJldHVybiByZXN1bHQuZGF0YVxuXHRcdH0pXG5cdH1cblxuXHRyZXR1cm4gRmVlZGJhY2tGYWN0b3J5XG59KSIsImFwcC5jb250cm9sbGVyKCdDcmVhdGVQb2xsJywgZnVuY3Rpb24oJHNjb3BlLCAkdWliTW9kYWwpIHtcblxuICAkc2NvcGUuc2hvd01vZGFsID0gZnVuY3Rpb24oKSB7XG5cbiAgICAkc2NvcGUub3B0cyA9IHtcbiAgICBiYWNrZHJvcDogdHJ1ZSxcbiAgICBiYWNrZHJvcENsaWNrOiB0cnVlLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgZGlhbG9nRmFkZTogZmFsc2UsXG4gICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgdGVtcGxhdGVVcmwgOiAnanMvY29tbW9uL2NyZWF0ZVBvbGxNb2RhbC9jcmVhdGVQb2xsTW9kYWwuaHRtbCcsXG4gICAgY29udHJvbGxlciA6IE1vZGFsSW5zdGFuY2VDdHJsLFxuICAgIHJlc29sdmU6IHt9IC8vIGVtcHR5IHN0b3JhZ2VcbiAgICAgIH07XG5cbiAgICAkc2NvcGUub3B0cy5yZXNvbHZlLml0ZW0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuY29weSh7cG9sbHM6JHNjb3BlLnBvbGxzfSk7IC8vIHBhc3MgbmFtZSB0byBEaWFsb2dcbiAgICB9XG5cbiAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJHVpYk1vZGFsLm9wZW4oJHNjb3BlLm9wdHMpO1xuXG4gICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vb24gb2sgYnV0dG9uIHByZXNzXG4gICAgICB9LGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vb24gY2FuY2VsIGJ1dHRvbiBwcmVzc1xuICAgICAgfSlcbiAgfVxuXG59KVxuXG52YXIgTW9kYWxJbnN0YW5jZUN0cmwgPSBmdW5jdGlvbigkc2NvcGUsICR1aWJNb2RhbEluc3RhbmNlLCAkdWliTW9kYWwsIGl0ZW0sIFBvbGxGYWN0b3J5KSB7XG5cbiAgJHNjb3BlLml0ZW0gPSBpdGVtO1xuXG4gIC8vICRzY29wZS5jdXN0b21PcHRpb25zID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gIC8vICAgJHNjb3BlLmN1c3RvbVNob3cgPSAob3B0aW9uID09PSAnY3VzdG9tJylcbiAgLy8gfVxuXG4gICRzY29wZS5zdWJtaXRQb2xsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb2xsID0ge31cbiAgICBwb2xsLnF1ZXN0aW9uID0gJHNjb3BlLm5ld1BvbGxcbiAgICBwb2xsLmxlY3R1cmVJZCA9IDFcbiAgICAvLyBwb2xsLm9wdGlvbnMgPSBbeydhJzogJHNjb3BlLmF9LCB7J2InOiAkc2NvcGUuYn0sIHsnYyc6ICRzY29wZS5jfV1cbiAgICBwb2xsLm9wdGlvbnMgPSBbJHNjb3BlLmEsICRzY29wZS5iLCAkc2NvcGUuY11cbiAgICB2YXIgY2hlY2sgPSBwb2xsLm9wdGlvbnMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIG5leHQpIHsgcmV0dXJuIHByZXYgJiYgKG5leHQgIT0gdW5kZWZpbmVkIHx8IG5leHQgIT0gbnVsbCl9LCB0cnVlKVxuICAgIGlmIChjaGVjaykge1xuICAgICAgUG9sbEZhY3RvcnkuY3JlYXRlUG9sbChwb2xsKVxuICAgICAgLnRoZW4oKCkgPT4geyByZXR1cm4gUG9sbEZhY3RvcnkuZ2V0QWxsQnlMZWN0dXJlSWQoMSkgfSlcbiAgICAgIC50aGVuKChwb2xscykgPT4geyAkc2NvcGUucG9sbHMgPSBwb2xscyB9KVxuICAgICAgLnRoZW4oKCkgPT4geyAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGFsZXJ0KFwiWW91IG11c3QgYWRkIGF0IGxlYXN0IG9uZSBxdWVzdGlvbiB0byB0aGUgcG9sbCFcIilcbiAgICB9XG5cbiAgfVxuXG4gICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gIH1cbn1cbiIsImFwcC5kaXJlY3RpdmUoJ2FjdGl2ZVBvbGwnLCAoJHN0YXRlLCBQb2xsRmFjdG9yeSwgUG9sbEFuc3dlckZhY3RvcnkpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiB7fSxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9saXZlUG9sbC9hY3RpdmVQb2xsLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICBzb2NrZXQub24oJ3RvU3R1ZGVudCcsIGZ1bmN0aW9uKHBvbGxRdWVzdGlvbikge1xuICAgICAgICBjb25zb2xlLmxvZyhcImhlbGxvXCIpXG4gICAgICAgIHNjb3BlLnBvbGwgPSBwb2xsUXVlc3Rpb25cbiAgICAgICAgc2NvcGUuJGRpZ2VzdCgpXG4gICAgICB9KVxuICAgICAgLy8gUG9sbEFuc3dlckZhY3RvcnkuZ2V0QWxsQnlQb2xsSWQoc2NvcGUucG9sbC5pZClcbiAgICAgIC8vIC50aGVuKChhbnN3ZXJzKT0+IHtcbiAgICAgIC8vICAgc2NvcGUuYW5zd2VycyA9IGFuc3dlcnNcbiAgICAgIC8vIH0pXG4gICAgICBzb2NrZXQub24oJ3VwZGF0ZUFjdGl2ZVBvbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgUG9sbEFuc3dlckZhY3RvcnkuZ2V0QWxsQnlQb2xsSWQoc2NvcGUucG9sbC5pZClcbiAgICAgICAgLnRoZW4oKGFuc3dlcnMpPT4ge1xuICAgICAgICAgIHNjb3BlLmFuc3dlcnMgPSBhbnN3ZXJzXG4gICAgICAgICAgc2NvcGUuY291bnRlZCA9IGNvdW50QW5zd2VycyhzY29wZS5hbnN3ZXJzKVxuICAgICAgICB9KVxuICAgICAgICBzY29wZS4kZGlnZXN0KClcbiAgICAgIH0pXG5cbiAgICAgIGZ1bmN0aW9uIGNvdW50QW5zd2VycyhhbnN3ZXJzKSB7XG4gICAgICAgIHZhciBjb3VudGVkID0ge31cbiAgICAgICAgYW5zd2Vycy5mb3JFYWNoKGZ1bmN0aW9uKGFuc3dlcikge1xuICAgICAgICAgIGlmICghY291bnRlZFthbnN3ZXIub3B0aW9uXSkgY291bnRlZFthbnN3ZXIub3B0aW9uXSA9IDFcbiAgICAgICAgICBlbHNlIGNvdW50ZWRbYW5zd2VyLm9wdGlvbl0gKz0gMVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gY291bnRlZFxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiIsImFwcC5kaXJlY3RpdmUoJ3BvbGwnLCAoJHN0YXRlLCBQb2xsRmFjdG9yeSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIHVzZUN0cmw6IFwiQFwiXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9wb2xsL3BvbGwuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUpIHtcblxuICAgICAgc2NvcGUuZGVsZXRlID0gUG9sbEZhY3RvcnkuZGVsZXRlUG9sbFxuXG4gICAgICBQb2xsRmFjdG9yeS5nZXRBbGxCeUxlY3R1cmVJZCgxKVxuICAgICAgLnRoZW4oKGN1cnJlbnRQb2xscykgPT4ge1xuICAgICAgICBzY29wZS5wb2xscyA9IGN1cnJlbnRQb2xsc1xuICAgICAgfSlcblxuICAgICAgc2NvcGUuc2VuZFBvbGwgPSBmdW5jdGlvbihwb2xsKSB7XG4gICAgICAgIHNvY2tldC5lbWl0KCdwb2xsT3V0JywgcG9sbClcbiAgICAgIH1cblxuICAgIH1cbiAgfVxufSlcbiIsImFwcC5mYWN0b3J5KCdQb2xsRmFjdG9yeScsICgkaHR0cCkgPT4ge1xuICBmdW5jdGlvbiBkb3REYXRhKGRvdCkge1xuICAgIHJldHVybiBkb3QuZGF0YVxuICB9XG4gIHZhciBjYWNoZWRQb2xscyA9IFtdXG4gIHJldHVybiB7XG4gICAgZ2V0QWxsQnlMZWN0dXJlSWQ6IChpZCkgPT4ge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9wb2xsL2xlY3R1cmUvJytpZClcbiAgICAgIC50aGVuKGRvdERhdGEpXG4gICAgICAudGhlbigocG9sbHMpID0+IHtcbiAgICAgICAgYW5ndWxhci5jb3B5KHBvbGxzLCBjYWNoZWRQb2xscylcbiAgICAgICAgcmV0dXJuIGNhY2hlZFBvbGxzXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2V0T25lQnlQb2xsSWQ6IChpZCkgPT4ge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9wb2xsLycraWQpXG4gICAgICAudGhlbihkb3REYXRhKVxuICAgIH0sXG4gICAgY3JlYXRlUG9sbDogKHBvbGxPYmopID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3BvbGwvJywgcG9sbE9iailcbiAgICAgIC50aGVuKGRvdERhdGEpXG4gICAgfSxcbiAgICB1cGRhdGVQb2xsOiAocG9sbE9iaiwgaWQpID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvcG9sbC8nK2lkLCBwb2xsT2JqKVxuICAgICAgLnRoZW4oZG90RGF0YSlcbiAgICB9LFxuICAgIGRlbGV0ZVBvbGw6IChpZCkgPT4ge1xuICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS9wb2xsLycraWQpXG4gICAgICAudGhlbihkb3REYXRhKVxuICAgICAgLnRoZW4oKHJlbW92ZWRQb2xsKSA9PiB7XG4gICAgICAgIGNhY2hlZFBvbGxzLnNwbGljZShjYWNoZWRQb2xscy5tYXAoZnVuY3Rpb24oaXRlbSkgeyByZXR1cm4gaXRlbS5pZCB9KS5pbmRleE9mKGlkKSwxKVxuICAgICAgICByZXR1cm4gY2FjaGVkUG9sbHNcbiAgICAgIH0pXG4gICAgfVxuICB9XG59KVxuIiwiYXBwLmZhY3RvcnkoJ1BvbGxBbnN3ZXJGYWN0b3J5JywgKCRodHRwKSA9PiB7XG4gIGZ1bmN0aW9uIGRvdERhdGEoZG90KSB7XG4gICAgcmV0dXJuIGRvdC5kYXRhXG4gIH1cbiAgdmFyIGNhY2hlZEFuc3dlcnMgPSBbXVxuICByZXR1cm4ge1xuICAgIGdldEFsbEJ5UG9sbElkOiAoaWQpID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvYW5zd2VyLycraWQpXG4gICAgICAudGhlbihkb3REYXRhKVxuICAgICAgLnRoZW4oKGFuc3dlcnMpID0+IHtcbiAgICAgICAgYW5ndWxhci5jb3B5KGFuc3dlcnMsIGNhY2hlZEFuc3dlcnMpXG4gICAgICAgIHJldHVybiBjYWNoZWRBbnN3ZXJzXG4gICAgICB9KVxuICAgIH0sXG4gICAgYW5zd2VyUG9sbDogKHBvbGxPYmopID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2Fuc3dlci8nLCBwb2xsT2JqKVxuICAgICAgLnRoZW4oZG90RGF0YSlcbiAgICB9XG4gIH1cbn0pXG4iLCJhcHAuZGlyZWN0aXZlKCdxdWVzdGlvbicsIGZ1bmN0aW9uKCRzdGF0ZSwgUXVlc3Rpb25GYWN0b3J5KSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL3F1ZXN0aW9uL3F1ZXN0aW9uLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSkge1xuXG4gICAgICAgICAgICBRdWVzdGlvbkZhY3RvcnkuZ2V0QWxsQnlMZWN0dXJlSWQoMSkudGhlbihmdW5jdGlvbihxdWVzdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBzY29wZS5xdWVzdGlvbnMgPSBxdWVzdGlvbnMuZmlsdGVyKGZ1bmN0aW9uKHEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHEuc3RhdHVzID09PSAnb3BlbidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgZnVuY3Rpb24gZmluZEluZGV4KHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY29wZS5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlLnF1ZXN0aW9uc1tpXS50ZXh0ID09PSBxdWVzdGlvbi50ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG1vdmUocXVlc3Rpb24sIG4pIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgocXVlc3Rpb24pXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4K24gPiAtMSAmJiBpbmRleCtuIDwgc2NvcGUucXVlc3Rpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5xdWVzdGlvbnMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgICAgICAgICAgICBzY29wZS5xdWVzdGlvbnMuc3BsaWNlKGluZGV4K24sIDAsIHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm5ld1F1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHt0ZXh0OiBzY29wZS5uZXdRdWVzdGlvbiwgc3VibWl0VGltZTogRGF0ZS5ub3coKSwgdXB2b3RlczogMH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFF1ZXN0aW9uRmFjdG9yeS5zdG9yZShxdWVzdGlvbikudGhlbihmdW5jdGlvbihxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnYWRkaW5nUXVlc3Rpb24nLCBxKVxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUubmV3UXVlc3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24ocXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnZGVsZXRpbmdRdWVzdGlvbicsIHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIHJldHVybiBRdWVzdGlvbkZhY3RvcnkuZGVsZXRlKHF1ZXN0aW9uKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS5jbG9zZSA9IGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgcXVlc3Rpb24uc3RhdHVzID0gJ2Nsb3NlZCdcbiAgICAgICAgICAgICAgICByZXR1cm4gUXVlc3Rpb25GYWN0b3J5LnVwZGF0ZShxdWVzdGlvbikudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnZGVsZXRpbmdRdWVzdGlvbicsIHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLm1vdmUgPSBmdW5jdGlvbihxdWVzdGlvbiwgbikge1xuICAgICAgICAgICAgICAgIHNvY2tldC5lbWl0KCdtb3ZlJywgcXVlc3Rpb24sIG4pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLnVwdm90ZSA9IGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgcXVlc3Rpb24uaGFzVXB2b3RlZCA9ICFxdWVzdGlvbi5oYXNVcHZvdGVkO1xuICAgICAgICAgICAgICAgIHF1ZXN0aW9uLnVwdm90ZXMrKztcbiAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgndXB2b3RpbmcnLCBxdWVzdGlvbilcbiAgICAgICAgICAgICAgICByZXR1cm4gUXVlc3Rpb25GYWN0b3J5LnVwZGF0ZShxdWVzdGlvbilcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2NvcGUuZG93bnZvdGUgPSBmdW5jdGlvbihxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIHF1ZXN0aW9uLmhhc1Vwdm90ZWQgPSAhcXVlc3Rpb24uaGFzVXB2b3RlZDtcbiAgICAgICAgICAgICAgICBxdWVzdGlvbi51cHZvdGVzLS07XG4gICAgICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2Rvd252b3RpbmcnLCBxdWVzdGlvbilcbiAgICAgICAgICAgICAgICByZXR1cm4gUXVlc3Rpb25GYWN0b3J5LnVwZGF0ZShxdWVzdGlvbilcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdhZGRRdWVzdGlvbicsIGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUucXVlc3Rpb25zLnVuc2hpZnQocXVlc3Rpb24pXG4gICAgICAgICAgICAgICAgc2NvcGUuJGV2YWxBc3luYygpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBzb2NrZXQub24oJ2RlbGV0ZVF1ZXN0aW9uJywgZnVuY3Rpb24ocXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXgocXVlc3Rpb24pXG4gICAgICAgICAgICAgICAgc2NvcGUucXVlc3Rpb25zLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICAgICAgICBzY29wZS4kZXZhbEFzeW5jKClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHNvY2tldC5vbigncmVjZWl2ZWRVcHZvdGUnLCBmdW5jdGlvbihxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGZpbmRJbmRleChxdWVzdGlvbilcbiAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSBzY29wZS5xdWVzdGlvbnNbaW5kZXhdXG4gICAgICAgICAgICAgICAgcXVlc3Rpb24udXB2b3RlcysrXG4gICAgICAgICAgICAgICAgc2NvcGUuJGV2YWxBc3luYygpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBzb2NrZXQub24oJ3JlY2VpdmVkRG93bnZvdGUnLCBmdW5jdGlvbihxdWVzdGlvbikge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGZpbmRJbmRleChxdWVzdGlvbilcbiAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSBzY29wZS5xdWVzdGlvbnNbaW5kZXhdXG4gICAgICAgICAgICAgICAgcXVlc3Rpb24udXB2b3Rlcy0tO1xuICAgICAgICAgICAgICAgIHNjb3BlLiRldmFsQXN5bmMoKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgc29ja2V0Lm9uKCdtb3ZpbmcnLCBmdW5jdGlvbihxdWVzdGlvbiwgbikge1xuICAgICAgICAgICAgICAgIG1vdmUocXVlc3Rpb24sIG4pXG4gICAgICAgICAgICAgICAgc2NvcGUuJGV2YWxBc3luYygpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufSk7XG4iLCJhcHAuZmFjdG9yeSgnUXVlc3Rpb25GYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG5cblx0dmFyIG9iaiA9IHt9O1xuXG5cdG9iai5nZXRBbGxCeUxlY3R1cmVJZCA9IGZ1bmN0aW9uKGxlY3R1cmVJZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvcXVlc3Rpb24vbGVjdHVyZS8nICsgbGVjdHVyZUlkKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pXG5cdH1cblxuXHRvYmouc3RvcmUgPSBmdW5jdGlvbihxdWVzdGlvbikge1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3F1ZXN0aW9uJywgcXVlc3Rpb24pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSlcblx0fVxuXG5cdG9iai51cGRhdGUgPSBmdW5jdGlvbihxdWVzdGlvbikge1xuXHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvcXVlc3Rpb24vJyArIHF1ZXN0aW9uLmlkLCBxdWVzdGlvbikudGhlbihmdW5jdGlvbihyZXMpIHtcblx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHR9KVxuXHR9XG5cblx0b2JqLmRlbGV0ZSA9IGZ1bmN0aW9uKHF1ZXN0aW9uKSB7XG5cdFx0cmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS9xdWVzdGlvbi8nICsgcXVlc3Rpb24uaWQpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSlcblx0fVxuXG5cdHJldHVybiBvYmo7XG5cbn0pO1xuIiwiYXBwLmNvbnRyb2xsZXIoJ1N0dWRlbnRQb2xsJywgZnVuY3Rpb24oJHNjb3BlLCAkdWliTW9kYWwpIHtcbiAgJHNjb3BlLnNob3dNb2RhbCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgJHNjb3BlLm9wdHMgPSB7XG4gICAgICBiYWNrZHJvcDogdHJ1ZSxcbiAgICAgIGJhY2tkcm9wQ2xpY2s6IHRydWUsXG4gICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgZGlhbG9nRmFkZTogZmFsc2UsXG4gICAgICBrZXlib2FyZDogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsIDogJ2pzL2NvbW1vbi9zdHVkZW50TW9kYWwvc3R1ZGVudFBvbGwuaHRtbCcsXG4gICAgICBjb250cm9sbGVyIDogU3R1ZGVudE1vZGFsSW5zdGFuY2UsXG4gICAgICByZXNvbHZlOiB7fSAvLyBlbXB0eSBzdG9yYWdlXG4gICAgfTtcblxuICAgICRzY29wZS5vcHRzLnJlc29sdmUuaXRlbSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGFuZ3VsYXIuY29weSh7cG9sbDokc2NvcGUucG9sbH0pOyAvLyBwYXNzIG5hbWUgdG8gRGlhbG9nXG4gICAgfVxuXG4gICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbigkc2NvcGUub3B0cyk7XG5cbiAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAvL29uIG9rIGJ1dHRvbiBwcmVzc1xuICAgIH0sZnVuY3Rpb24oKXtcbiAgICAgIC8vb24gY2FuY2VsIGJ1dHRvbiBwcmVzc1xuICAgIH0pXG4gIH1cblxuICBzb2NrZXQub24oJ3RvU3R1ZGVudCcsIGZ1bmN0aW9uKHBvbGxRdWVzdGlvbikge1xuICAgICRzY29wZS5wb2xsID0gcG9sbFF1ZXN0aW9uXG4gICAgJHNjb3BlLnNob3dNb2RhbCgpXG4gIH0pXG5cbn0pXG5cbmZ1bmN0aW9uIFN0dWRlbnRNb2RhbEluc3RhbmNlKCRzY29wZSwgJHVpYk1vZGFsSW5zdGFuY2UsICR1aWJNb2RhbCwgaXRlbSwgUG9sbEZhY3RvcnksIFBvbGxBbnN3ZXJGYWN0b3J5KSB7XG5cbiAgJHNjb3BlLml0ZW0gPSBpdGVtO1xuXG4gICRzY29wZS5zdWJtaXRBbnN3ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFuc3dlciA9IHtcbiAgICAgIHBvbGxJZDogJHNjb3BlLml0ZW0ucG9sbC5pZCxcbiAgICAgIG9wdGlvbjogJHNjb3BlLmFuc3dlclxuICAgIH1cblxuICAgIFBvbGxBbnN3ZXJGYWN0b3J5LmFuc3dlclBvbGwoYW5zd2VyKVxuICAgIC50aGVuKCgpPT4ge1xuICAgICAgc29ja2V0LmVtaXQoJ3N0dWRlbnRBbnN3ZXInKVxuICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoKVxuICAgIH0pXG4gIH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
