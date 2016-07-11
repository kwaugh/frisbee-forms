var express = require('express');
var router = express.Router();

var names = DB.collection('names');

/* Delete the specified form */
router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('/admin');
        return;
    }
    console.log('deleting all contacts');

    names.remove();
    res.redirect('/contact_info');
});

module.exports = router;
