var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

var forms = DB.collection('forms');

/* Admin page for creating new forms */
router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('admin');
        return;
    }
    if (!validateParams(req, ['form-name', 'timezone-offset', 'close-datetime'])) {
        res.render('new_form');
        return;
    }
    /* Time to build the database entry */
    var form = {name: req.body['form-name'], items: [], live: false,
        team_id: ObjectID(req.session.team_id)};
    if (hasParam(req, 'form-id')) { // updating existing form
        form['_id'] = new ObjectID(req.body['form-id']);
    }
    var current_item_num = -1;
    for (var key in req.body) {
        if (key.indexOf('item-num') === 0) { // It's a new item
            var item_id = '';
            if (hasParam(req, 'id-' + key)) { // updating existing item
                item_id = new ObjectID(req.body['id-' + key]);
            } else { // It's a new item
                item_id = new ObjectID(); // orders are linked to this id
            }
            form.items.push(
                {name: req.body[key], sizes: [], subitems: [], 'item_id': item_id}
            );
            current_item_num++;
        } else if (key.indexOf('subitem-num') === 0) { // new subitem
            var subitem_id = '';
            if (hasParam(req, 'id-' + key)) { // updating existing subitem
                subitem_id = new ObjectID(req.body['id-' + key]);
            } else { // it's a new subitem
                subitem_id = new ObjectID();
            }
            form.items[current_item_num].subitems.push(
                {name: req.body[key], sizes:[], 'subitem_id': subitem_id}
            );
        } else if (key.indexOf('item-size') === 0) {
            form.items[current_item_num].sizes = [].concat(req.body[key]);
        } else if (key.indexOf('subitem-size') === 0) {
            form.items[current_item_num].subitems[form.items[current_item_num].
                subitems.length - 1].sizes = [].concat(req.body[key]); 
        } else if (key.indexOf('close-datetime') === 0) { // The closing datetime
            var server_offset = new Date().getTimezoneOffset();
            var client_offset = req.body['timezone-offset'];
            var orig_time = new Date(req.body[key]);
            orig_time = new Date(orig_time.getTime() + client_offset * 60 * 1000);
            form.date = new Date(orig_time.getTime() +
                    ((client_offset - server_offset) * 60 * 1000));
            form.client_date_offset = client_offset;
        } else if (key.indexOf('form-live') === 0) { // is the form live?
            form.live = true;
        }
    }
    forms.save(form);
    res.redirect('admin');
});

module.exports = router;

function hasParam(req, param) {
    return (req.body[param] !== undefined && req.body[param] !== '');
}

function validateParams(req, paramsList) {
    if (!req.body || req.body === null || req.body == {})
        return false;
    for (var param of paramsList) {
        var current = req.body[param];
        if (current === undefined || current === '')
            return false;
    }
    return true;
}
