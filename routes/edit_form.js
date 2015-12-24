var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('admin');
        return;
    }
    res.render('edit_form', {});
});

module.exports = router;
