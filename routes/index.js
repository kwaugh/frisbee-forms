var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');

/* GET home page. */
router.get('/', function(req, res, next) {
    forms.find({}, function(err, doc) {
        console.log('doc:', doc);
        var current_date = new Date();
        for (var i in doc) {
            if (doc[i].date < current_date) {
                doc.splice(i, 1);
            }
        }
        res.render('index', { title: 'Frisbee Order Form' , forms: doc });
    });
});

module.exports = router;
