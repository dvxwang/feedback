app.factory('PollFactory', ($http) => {

  let PollFactory = {}
  let cachedPolls = { pending: [], favorite: [] }

  function dotData(dot) {
    return dot.data;
  }

  function cleanCache(arr, id) {
    arr.splice(arr.map(function(item) { return item.id }).indexOf(id),1);
  }

  function setCache(polls) {
    angular.copy(polls[0], cachedPolls.pending);
    angular.copy(polls[1], cachedPolls.favorite);
    return cachedPolls
  }

  function checkSent(poll) {
    if (poll.status !== "sent") cachedPolls[poll.status].push(poll);
    return poll
  }

  PollFactory.getAllByLectureId = (id) => {
    return $http.get('/api/poll/lecture/'+id)
    .then(dotData)
    .then(setCache);
  }

  PollFactory.getOneByPollId = (id) => {
    return $http.get('/api/poll/'+id)
    .then(dotData);
  }

  PollFactory.createPoll = (pollObj) => {
    return $http.post('/api/poll/', pollObj)
    .then(dotData)
    .then(checkSent);
  }

  PollFactory.updatePoll = (poll, pollObj) => {
    if (poll.status === "pending") cleanCache(cachedPolls[poll.status], poll.id)
    return $http.put('/api/poll/'+poll.id, pollObj)
    .then(dotData);
  }

  PollFactory.deletePoll = (poll) => {
    cleanCache(cachedPolls[poll.status], poll.id)
    return $http.delete('/api/poll/'+poll.id)
    .then(dotData);
  }

  return PollFactory

})
