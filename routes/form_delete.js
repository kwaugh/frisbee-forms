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
    console.log('deleting form', form);
    if (!form || form === null || form.length === 0) {
        res.redirect('/admin');
        return;
    }
    forms.remove({name: form});
    orders.remove({form_name: form});

    res.redirect('/admin');
});

module.exports = router;
