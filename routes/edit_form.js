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
                var closing_date = new Date(doc.date);
                closing_date = convertToHTMLDate(closing_date)
                res.render('edit_form', {form: doc, close: closing_date, min_date: convertToHTMLDate(Date.now())});
            }
            
        });

    } else { // They need to select a form
        forms.find({}, function(err, docs) {
            res.render('select_edit_form', {forms: docs});
        });
    }
});

function convertToHTMLDate(date) {
    var closing_date = new Date(date);
    var string_date = closing_date.toISOString();
    // Give HTML the formatting it expects
    return string_date.substring(0, string_date.lastIndexOf(':'));

}

module.exports = router;
