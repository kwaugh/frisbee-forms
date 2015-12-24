var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {
    res.render('new_form', {});
});

module.exports = router;
