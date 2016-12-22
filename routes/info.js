var express = require('express');
var router = express.Router();

var names = DB.collection('names');

router.all('/', function(req, res, next) {
    var form = req.body.form;
    if (!form || form === null) {
        res.redirect('/');
        return;
    }

    names.find({}, function(err, doc) {
        doc.sort(function(a, b) {
            if (a.name > b.name)
                return 1;
            else if (a.name < b.name)
                return -1;
            return 0;
        });
        res.render('info', {'form': form, 'names': doc});
    });

});

module.exports = router;
