var express = require('express');
var router = express.Router();

var admins = DB.collection('admins');
//var bcrypt = require('bcrypt-nodejs');

/* Admin page. */
router.all('/', function(req, res, next) {
    if (req.session.admin) {
        res.render('admin', { title: 'Admin page' });
        return;
    }
    if (req.body['admin-password']) {
        admins.findOne({}, function(err, doc) {
            if (req.body['admin-password'] === doc.password) {
                req.session.admin = true;
                res.render('admin', { title: 'Admin page' });
            } else {
                res.render('admin_password', { title: 'Admin page' });
            }
        });
    } else {
        res.render('admin_password', { title: 'Admin page' });
    }
});

module.exports = router;
