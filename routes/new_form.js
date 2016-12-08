var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');

/* Admin page for creating new forms */
router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('admin');
        return;
    }
    if (!req.body || req.body === null || req.body == {} || !req.body['form-name'] ||
            !req.body['timezone-offset']) {
        res.render('new_form', {});
        return;
    }
    /* Time to build the database entry */
    var form = {name: req.body['form-name'], items: [], live: false};
    var current_item_num = -1;
    for (var key in req.body) {
        if (key.indexOf('item-num') === 0) { // It's a new item
            form.items.push({name: req.body[key], sizes: [], subitems: []}); 
            current_item_num++;
        } else if (key.indexOf('subitem-num') === 0) {
            form.items[current_item_num].subitems.push({name: req.body[key], sizes:[]});
        } else if (key.indexOf('item-size') === 0) {
            form.items[current_item_num].sizes = [].concat(req.body[key]);
        } else if (key.indexOf('subitem-size') === 0) {
            form.items[current_item_num].subitems[form.items[current_item_num].subitems.length - 1].sizes = [].concat(req.body[key]); 
        } else if (key.indexOf('close-datetime') === 0) { // The closing datetime
            var server_offset = new Date().getTimezoneOffset();
            var client_offset = req.body['timezone-offset'];
            var orig_time = new Date(req.body[key]);
            orig_time = new Date(orig_time.getTime() + client_offset * 60 * 1000);
            form.date = new Date(orig_time.getTime() + ((client_offset - server_offset) * 60 * 1000));
            form.client_date_offset = client_offset;
        } else if (key.indexOf('form-live') === 0) { // is the form live?
            form.live = true;
        }
    }
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
