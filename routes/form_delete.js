var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');
var orders = DB.collection('orders');
var ObjectID = require('mongodb').ObjectID;

/* Delete the specified form */
router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('/admin');
        return;
    }
    var form = new ObjectID(req.body['form-id']);
    if (!form || form === null || form.length === 0) {
        res.redirect('/admin');
        return;
    }
    forms.find({_id: form, team: req.session.team}, function(err, forms_to_delete) {
        for (var form of forms_to_delete) {
            orders.remove({form_id: form._id, team: req.session.team});
            forms.remove({_id: form._id, team: req.session.team});
        }
    });

    res.redirect('/admin');
});

module.exports = router;
