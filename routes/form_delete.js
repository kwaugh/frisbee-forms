var express = require('express');
var router = express.Router();

var ObjectID = require('mongodb').ObjectID;
var forms = DB.collection('forms');
var orders = DB.collection('orders');

/* Delete the specified form */
router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('/admin');
        return;
    }
    var form = req.body['form-name']; 
    if (!form || form === null || form.length === 0) {
        res.redirect('/admin');
        return;
    }
    forms.find({name: form, team_id: ObjectID(req.session.team_id)}, function(err, forms_to_delete) {
        for (var form of forms_to_delete) {
            orders.remove({form_id: form._id, team_id: ObjectID(req.session.team_id)});
            forms.remove({name: form.name, team_id: ObjectID(req.session.team_id)});
        }
    });

    res.redirect('/admin');
});

module.exports = router;
