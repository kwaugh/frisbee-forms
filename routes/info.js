var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {
    var form = req.body['form'];
    if (!form || form == null) {
        res.redirect('/');
        return;
    }

    res.render('info', {'form': form, 'names': []});
});

module.exports = router;
