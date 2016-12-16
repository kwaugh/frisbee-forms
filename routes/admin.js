var express = require('express');
var router = express.Router();
 
var ObjectID = require('mongodb').ObjectID;
var admins = DB.collection('admins');
//var bcrypt = require('bcrypt-nodejs');

/* Admin page. */
router.all('/', function(req, res, next) {
    if (req.session.admin) {
        res.render('admin', { team: req.session.team});
        return;
    }
    var password = req.body['admin-password'];
    var team = req.body['team'];
    if (password && password !== '' && team && team !== '') {
        admins.findOne({'password': password, 'team': team}, function(err, admin) {
            if (admin) {
                req.session.admin = true;
                req.session.team = team;
                req.session.team_id = admin._id;
                res.render('admin', {'team': team});
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
