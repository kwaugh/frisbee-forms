var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');
var ObjectID = require('mongodb').ObjectID;

/* Clone the specified form */
router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('admin');
        return;
    }
    var form = new ObjectID(req.body['form-id']);
    if (!form || form === null || form.length === 0) {
        res.redirect('admin');
        return;
    }
    forms.findOne({_id: form, team: req.session.team}, function(err, orig_form) {
        if (!form || err) {
            res.redirect('admin');
            return;
        }
        var new_name = orig_form.name + "_clone";
        var form_clone = orig_form;
        form_clone.name = new_name;
        delete form_clone['_id'];
        forms.save(form_clone);
    });

    res.redirect('/admin');
});

module.exports = router;
