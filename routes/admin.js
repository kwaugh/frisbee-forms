var express = require('express');
var router = express.Router();

var admins = DB.collection('admins');
//var bcrypt = require('bcrypt-nodejs');

/* Admin page. */
router.all('/', function(req, res, next) {
    console.log('Admin password:', req.param('admin-password'));
    if (req.session.admin) {
        res.render('admin', { title: 'Admin page' });
    }
    if (req.param('admin-password')) {
        admins.findOne({}, function(err, doc) {
            if (req.param('admin-password') === doc.password) {
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
