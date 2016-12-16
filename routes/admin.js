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
    var password = req.body['admin-password'];
    var team = req.body['team'];
    if (password && password !== '' && team && team !== '') {
        admins.findOne({'password': password, 'team': team}, function(err, admin) {
            if (admin) {
                req.session.admin = true;
                req.session.team = team;
                res.render('admin', { title: 'Admin page' });
            } else {
                render_login(req, res);
            }
        });
    } else {
        render_login(req, res);
    }
});

function render_login(req, res) {
    admins.find({}, function(err, admins) {
        var teams = [];
        for (var admin of admins) {
            teams.push(admin.team);
        }
        res.render('admin_password', {'teams': teams});
    });
}

module.exports = router;
