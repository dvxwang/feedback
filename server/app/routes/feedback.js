var router = require('express').Router();
var db = require('../../database');
var Feedback = db.model('feedback');

router.get('/', function (req, res, next) {
    Feedback.findAll()
    .then(function(result){
        res.json(result);
    });
});

router.get('/:feedbackId', function (req, res, next) {
    Feedback.findById(req.params.feedbackId)
    .then(function(result){
        res.json(result);
    });
});

router.get('/count/:lectureId/:category', function (req, res, next) {
    var now = new Date()
    Feedback.findAndCountAll({
        where: {
            lectureId: req.params.lectureId,
            category: req.params.category,
            createdAt: {
                $lt: now,
                $gt: new Date(now - 30 * 1000)
            }
        }
    }
    )
    .then(function(result){
        res.json(result.count);
    });
});

router.post('/:lectureId', function (req, res, next) {
    req.body.lectureId = req.params.lectureId
    Feedback.create(req.body)
    .then(function(result){
        res.json(result);
    });
});

router.delete('/:feedbackId', function (req, res, next) {
	Feedback.delete({
		where: {
			id: req.params.feedbackId
		}
	})
	.then(function(result) {
		res.json(result)
	})
})

module.exports = router;

