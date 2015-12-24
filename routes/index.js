var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');

/* GET home page. */
router.get('/', function(req, res, next) {
    forms.find({}, function(err, doc) {
        console.log('doc:', doc);
        res.render('index', { title: 'Frisbee Order Form' , forms: doc });
    });
});

module.exports = router;
