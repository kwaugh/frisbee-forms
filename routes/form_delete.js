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
    console.log('form:', form);
    console.log('team_id:', req.session.team_id);
    orders.remove({'form_id': form});
    forms.remove({'_id': form});

    res.redirect('/admin');
});

module.exports = router;
