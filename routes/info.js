var express = require('express');
var router = express.Router();

var names = DB.collection('names');

router.all('/', function(req, res, next) {
    var form = req.body['form'];
    if (!form || form == null) {
        res.redirect('/');
        return;
    }

    names.find({}, function(err, doc) {
        res.render('info', {'form': form, 'names': doc});
    });

});

module.exports = router;
