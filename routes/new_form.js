var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {
    console.log('req.body:', req.body);
    res.render('new_form', {});
});

module.exports = router;
