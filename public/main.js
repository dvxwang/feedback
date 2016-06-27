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
app.directive('poll', function ($state, PollFactory) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/poll/poll.html',
    link: function link(scope) {
      PollFactory.getAllByLectureId(1).then(function (polls) {
        scope.polls = polls;
      });
    }
  };
});

app.factory('PollFactory', function ($http) {
  function dotData(dot) {
    return dot.data;
  }
  return {
    dotData: function dotData(dot) {
      return dot.data;
    },
    getAllByLectureId: function getAllByLectureId(id) {
      return $http.get('/api/poll/lecture/' + id).then(dotData);
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
      return $http.delete('/api/poll/' + id).then(dotData);
    }
  };
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
        }
    };
});

app.directive('poll', function ($state, PollFactory) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/poll/poll.html',
        link: function link(scope) {
            PollFactory.getAllByLectureId(1).then(function (polls) {
                scope.polls = polls;
            });
        }
    };
});

app.factory('PollFactory', function ($http) {
    function dotData(dot) {
        return dot.data;
    }
    return {
        dotData: function dotData(dot) {
            return dot.data;
        },
        getAllByLectureId: function getAllByLectureId(id) {
            return $http.get('/api/poll/lecture/' + id).then(dotData);
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
            return $http.delete('/api/poll/' + id).then(dotData);
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

      scope.submit = function () {
        if (scope.newQuestion) scope.questions.unshift({ text: scope.newQuestion, submitTime: Date.now() });
        scope.newQuestion = null;
      };

      scope.delete = function (question) {
        var index = scope.questions.indexOf(question);
        scope.questions.splice(index, 1);
      };

      scope.store = function (question, status) {
        question.status = status;
        QuestionFactory.store(question).then(function () {
          scope.delete(question);
        });
      };
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

  return obj;
});
