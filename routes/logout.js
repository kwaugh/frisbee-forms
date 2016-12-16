var express = require('express');
var router = express.Router();

/* Admin page. */
router.get('/', function(req, res, next) {
    req.session.destroy();
    res.redirect('admin');
});

module.exports = router;
