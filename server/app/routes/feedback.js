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

router.get('/count/:category', function (req, res, next) {
    var now = new Date()
    Feedback.findAndCountAll({
        where: {
            category: req.params.category,
            createdAt: {
                $lt: now,
                $gt: new Date(now - 5 * 1000)
            }
        }
    }
    )
    .then(function(result){
        console.log(result.count)
        res.json(result.count);
    });
});

router.post('/', function (req, res, next) {
    console.log('Got HERE', req.body)
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

