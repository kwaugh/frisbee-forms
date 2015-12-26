var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');

/* Delete the specified form */
router.all('/', function(req, res, next) {
    var form = req.body['form-name']; 
    if (!form || form === null || form.length === 0) {
        res.redirect('/admin');
        return;
    }
    forms.remove({name: form});
    res.redirect('/admin');
});

module.exports = router;
