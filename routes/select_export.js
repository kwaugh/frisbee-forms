var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');

router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('/admin');
        return;
    }

    forms.find({team: req.session.team}, function(err, docs) {
        if (!err && docs) {
            res.render('select_export', {forms: docs});
        } else {
            res.redirect('/admin');
            return;
        }
    });
});

module.exports = router;
