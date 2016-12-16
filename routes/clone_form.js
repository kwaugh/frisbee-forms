var express = require('express');
var router = express.Router();

var ObjectID = require('mongodb').ObjectID;
var forms = DB.collection('forms');

/* Clone the specified form */
router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('admin');
        return;
    }
    var form = req.body['form-name'];
    if (!form || form === null || form.length === 0) {
        res.redirect('admin');
        return;
    }
    forms.findOne({name: form, team_id: ObjectID(req.session.team_id)}, function(err, orig_form) {
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
