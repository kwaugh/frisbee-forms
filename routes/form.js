var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');

/* Form page */
router.all('/', function(req, res, next) {
    var form = req.body['form'];
    if (!form || form === null) {
        res.redirect('/');
        return;
    }
    forms.findOne({name: form}, function(err, docs) {
        if (err || !docs || docs.length === 0) {
            res.redirect('/');
            return;
        }
        console.log('docs:', docs);
        res.render('form', { title: docs.name + ' Order Form', form: docs, default_number: req.body['default-jersey-number']});
    });
    
});

module.exports = router;
