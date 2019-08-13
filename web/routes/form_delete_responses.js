var express = require('express');
var router = express.Router();

var orders = DB.collection('orders');
var ObjectID = require('mongodb').ObjectID;

router.all('/', function(req, res, next) {
    if (!req.session.admin || !req.body['form-id'] || req.body['form-id'] == '') {
        res.redirect('/admin');
        return;
    }
    orders.remove({form_id: new ObjectID(req.body['form-id'])});
    res.redirect('/admin');
    return;
});

module.exports = router;
