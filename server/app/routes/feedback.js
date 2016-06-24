var router = require('express').Router();
var db = require('../../database');
var Feedback = db.model('feedback');

router.get('/', function (req, res, next) {
    Feedback.findAll()
    .then(function(result){
        res.send(result);
    });
});

router.get('/:feedbackId', function (req, res, next) {
    Feedback.findById(req.params.id)
    .then(function(result){
        res.send(result);
    });
});

router.post('/', function (req, res, next) {
    Feedback.create(req.body)
    .then(function(result){
        res.send(result);
    });
});

router.delete('/:feedbackId', function (req, res, next) {
	Feedback.delete({
		where: {
			id: req.params.feedbackId
		}
	})
	.then(function(result) {
		res.send(result)
	})
})

module.exports = router;

