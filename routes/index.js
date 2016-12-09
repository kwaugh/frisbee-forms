var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');

/* GET home page. */
router.get('/', function(req, res, next) {
    forms.find({}, function(err, doc) {
        var current_date = new Date();
        var open_forms = [];
        var closed_forms = [];
        for (var i in doc) {
            if (!doc[i].live) { // only show the live forms
                continue;
            }
            if (doc[i].date >= current_date) {
                open_forms.push(doc[i]);
            } else {
                closed_forms.push(doc[i]);
            }
        }
        res.render('index', { title: 'Frisbee Order Form' , 'open_forms': open_forms,
            'closed_forms': closed_forms });
    });
});

module.exports = router;
