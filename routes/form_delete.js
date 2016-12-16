var express = require('express');
var router = express.Router();

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
    forms.find({name: form, team: req.session.team}, function(err, forms_to_delete) {
        for (var form of forms_to_delete) {
            orders.remove({form_id: form._id, team: req.session.team});
            forms.remove({name: form.name, team: req.session.team});
        }
    });

    res.redirect('/admin');
});

module.exports = router;
