var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');
var names = DB.collection('names');
var orders = DB.collection('orders');

/* User page for filling out forms */
router.all('/', function(req, res, next) {
    var form = req.body['form'];
    var textbox_name = req.body['textbox-name'];
    var select_name = req.body['select-name']
    var jersey_number = req.body['default-jersey-number'];
    if (!isValidForm(form, textbox_name, select_name, jersey_number)) {
        res.redirect('/');
        return;
    }
    var name = '';
    /* Default to select name if it is filled out */
    if (select_name && select_name !== null && select_name !== 'Custom') {
        name = select_name;
    } else {
        name = textbox_name;
    }
    name = name.trim();
    // Add jersey number to player name
    names.findOne({'name': name}, function(err, doc) {
        if ((err || !doc || doc === '') && name !== '') {
            // Save their preferred number
            names.save({'name': name, 'number': jersey_number});
        } else {
            names.update(doc, {'name': name, 'number': jersey_number});
        }
    });
    forms.findOne({name: form}, function(err, docs) {
        if (err || !docs || docs.length === 0) {
            res.redirect('/');
            return;
        }
        orders.findOne({player_name: name, form_name: form}, function(err, doc) {
            console.log('doc:', doc);
            if (err || !doc) {
                res.render('form', { title: docs.name + ' Order Form', form: docs, default_number: jersey_number, 'name': name, order: {}});
            } else {
                console.log('I found a previous order');
                res.render('form', { title: docs.name + ' Order Form', form: docs, default_number: jersey_number, 'name': name, order: doc});
            }
        });
    });
    
});

function isValidForm(form, textbox_name, select_name, jersey_number) {
    return (form && form !== null && ((textbox_name && textbox_name !== null) || (select_name && select_name !== null)) && jersey_number && jersey_number !== null);
}

module.exports = router;
