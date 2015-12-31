var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');

/* Admin page for creating new forms */
router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('admin');
        return;
    }
    console.log('req.body:', req.body);
    if (!req.body || req.body === null || req.body == {} || !req.body['form-name']) {
        console.log('empty body');
        res.render('new_form', {});
        return;
    }
    console.log('im here');
    /* Time to build the database entry */
    var form = {name: req.body['form-name'], items: []};
    var current_item_num = -1;
    for (var key in req.body) {
        if (key.indexOf('item-num') === 0) { // It's a new item
            console.log('key:', key);
            form.items.push({name: req.body[key], sizes: [], subitems: []}); 
            current_item_num++;
        } else if (key.indexOf('subitem-num') === 0) {
            form.items[current_item_num].subitems.push({name: req.body[key], sizes:[]});
        } else if (key.indexOf('item-size') === 0) {
            form.items[current_item_num].sizes = [].concat(req.body[key]);
        } else if (key.indexOf('subitem-size') === 0) {
            form.items[current_item_num].subitems[form.items[current_item_num].subitems.length - 1].sizes = [].concat(req.body[key]); 
        } else if (key.indexOf('close-datetime') === 0) { // The closing datetime
            form.date = new Date(req.body[key]);
        }
    }
    console.log('form:', JSON.stringify(form));
    if (req.body['form-name'] && req.body['form-name'] !== null) {
        forms.findOne({name: req.body['form-name']}, function(err, doc) {
            if (!err && doc && doc !== null) { // Update if it exists, create new otherwise
                forms.update(doc, form);
            } else {
                forms.save(form);
            }
        });
    }
    res.render('admin', {});
    //res.redirect('admin', {});
});

module.exports = router;
