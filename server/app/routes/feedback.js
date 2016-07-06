var router = require('express').Router();
var db = require('../../database');
var Feedback = db.model('feedback');
var Lecture = db.model('lecture');
var adminBrowsers = require('../../database/adminBrowser.js');
var request = require('request');

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

    return Feedback.findOne({
        where: {
            category: req.params.category,
            lectureId: req.params.lectureId,
            comment: "adminReset"
        },
        order: [['updatedAt', 'DESC']]
    })
    .then(function (result) {
        if (result) {
            return result
        }
        else {
            return Lecture.findOne({
                where: {
                    id: req.params.lectureId,
                },
                // order: [['createdAt', 'ASC']]
            })
        }
    })
    .then(function (result) {
        return result.createdAt
    })
    .then(function (lastClearTime) {
        return Feedback.findAndCountAll({
            where: {
                lectureId: req.params.lectureId,
                category: req.params.category,
                createdAt: {
                    $lt: now,
                    $gt: new Date(lastClearTime)
                }
            }
        }
        )  
    })
    .then(function(result){
        res.json(result.count);
    });
});

router.post('/:lectureId', function (req, res, next) {
    var io = req.app.get('socketio');
    req.body.lectureId = req.params.lectureId;
    Feedback.create(req.body)
    .then(function(result){
        io.emit('submittedFeedback', result.dataValues.category);

        var adminList = adminBrowsers.getAdmin();
        for (var i=0; i<adminList.length; i++) {

            var dest = JSON.stringify({"to":adminList[i]});
            
            request({
                url: "https://android.googleapis.com/gcm/send",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "key=AIzaSyCUjoRzEBbZk-JfGeZTR1gugbeKjQolJtA"
                },
                body: dest
            }, function (error, response, body){
                console.log(response);
            });
        };

        if (!result.comment) io.emit('updateChart', result.category)
        io.emit('updateFeedback', result.category);
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

