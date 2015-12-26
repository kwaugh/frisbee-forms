var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');

/* Admin page for editing existing forms */
router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('admin');
        return;
    }
    if (req.body['form-name']) { // They have selected a form
        forms.findOne({name: req.body['form-name']}, function(err, doc) {
            if (err || !doc || doc.length === {}) {
                res.redirect('/admin');
            } else {
                res.render('edit_form', {form: doc});
            }
            
        });

    } else { // They need to select a form
        forms.find({}, function(err, docs) {
            res.render('select_edit_form', {forms: docs});
        });
    }
});

module.exports = router;
