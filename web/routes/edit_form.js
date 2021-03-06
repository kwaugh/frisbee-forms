var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

var forms = DB.collection('forms');

/* Admin page for editing existing forms */
router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('admin');
        return;
    }
    if (req.body['form-name']) { // They have selected a form
        forms.findOne({name: req.body['form-name'], team_id: ObjectID(req.session.team_id)},
                function(err, doc) {
            if (err || !doc || doc.length === {}) {
                res.redirect('/admin');
            } else {
                var closing_date = new Date(doc.date);
                closing_date = convertToHTMLDate(closing_date, doc.client_date_offset);
                res.render('edit_form',
                    {form: doc, close: closing_date,
                        min_date: convertToHTMLDate(Date.now()),
                        form_id: doc._id
                    }
                );
            }
            
        });

    } else { // They need to select a form
        forms.find({team_id: ObjectID(req.session.team_id)}, function(err, docs) {
            res.render('select_edit_form', {forms: docs});
        });
    }
});

function convertToHTMLDate(date, client_offset) {
    if (!client_offset) client_offset = 0; /* migration handling */
    var closing_date = new Date(date);
    closing_date = new Date(closing_date.getTime() - client_offset * 60 * 1000);
    var string_date = closing_date.toISOString();
    // Give HTML the formatting it expects
    return string_date.substring(0, string_date.lastIndexOf(':'));

}

module.exports = router;
