var express = require('express');
var router = express.Router();

/* Contact info page. */
var names = DB.collection('names');
router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('admin');
        return;
    }
    names.find({}, function(err, docs) {
        res.render('contact_info', {'contacts': docs});
    });
});

module.exports = router;
