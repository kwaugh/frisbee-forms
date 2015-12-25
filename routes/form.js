var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');
var names = DB.collection('names');

/* Form page */
router.all('/', function(req, res, next) {
    var form = req.body['form'];
    var textbox_name = req.body['textbox-name'];
    var select_name = req.body['select-name']
    var jersey_number = req.body['default-jersey-number'];
    if (!isValidForm(form, textbox_name, select_name, jersey_number)) {
        res.redirect('/');
        return;
    }
    var name;
    /* Default to select name if it is filled out */
    if (select_name && select_name !== null && select_name !== 'Custom') {
        name = select_name;
    } else {
        name = textbox_name;
    }
    names.findOne({'name': name}, function(err, docs) {
        if (err || !docs || docs.length === 0) {
            names.save({'name': name});
        }
    });
    forms.findOne({name: form}, function(err, docs) {
        if (err || !docs || docs.length === 0) {
            res.redirect('/');
            return;
        }
        console.log('docs:', docs);
        res.render('form', { title: docs.name + ' Order Form', form: docs, default_number: jersey_number});
    });
    
});

function isValidForm(form, textbox_name, select_name, jersey_number) {
    return (form && form !== null && ((textbox_name && textbox_name !== null) || (select_name && select_name !== null)) && jersey_number && jersey_number !== null);
}

module.exports = router;
