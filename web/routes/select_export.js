var express = require('express');
var router = express.Router();

var ObjectID = require('mongodb').ObjectID;
var forms = DB.collection('forms');

router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('/admin');
        return;
    }

    forms.find({team_id: ObjectID(req.session.team_id)}, function(err, docs) {
        if (!err && docs) {
            docs.sort(function(a, b) {
               return a.name > b.name;
            });
            res.render('select_export', {forms: docs});
        } else {
            res.redirect('/admin');
            return;
        }
    });
});

module.exports = router;
