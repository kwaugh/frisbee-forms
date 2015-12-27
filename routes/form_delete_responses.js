var express = require('express');
var router = express.Router();

var orders = DB.collection('orders');

router.all('/', function(req, res, next) {
    if (!req.session.admin || !req.body['form-name'] || req.body['form-name'] == '') {
        res.redirect('/admin');
        return;
    }
    console.log('About to delete');
    orders.remove({form_name: req.body['form-name']});
    res.redirect('/admin');
    return;
});

module.exports = router;
