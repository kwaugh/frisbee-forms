var express = require('express');
var router = express.Router();

var orders = DB.collection('orders');
var forms = DB.collection('forms');

/* Page to validate user form submissions */
router.all('/', function(req, res, next) {
    if (!req.body['form-name']) {
        res.redirect('/');
        return;
    }
    var form_name = req.body['form-name'];
    var order = {team: req.body['team'],
        items: []};
    var item_num = -1;
    for (var key in req.body) {
        if (key.indexOf('name') === 0) {
            order.player_name = req.body[key]; 
        } else if (key.indexOf('quantity') === 0) {
            var name = key.substring(key.indexOf('-') + 1).split('_').join(' ');
            var quantity = req.body[key];
            var item = {'name': name, 'quantity': quantity, numbers: []};
            order.items.push(item);
            item_num++;
        } else if (key.indexOf('number') === 0) {
            order.items[item_num].numbers.push(req.body[key]);
        }
    }

    forms.findOne({name: form_name}, function(err, doc) {
        if (err || !doc) {
            res.redirect('/');
            return;
        }
        var close_date = new Date(doc.date);
        // The form is closed
        if (Date.now() > close_date || !doc.live) {
            res.redirect('/');
            return;
        }
        orders.find({player_name: order.player_name, form_id: order.form_id}, function(err, docs) {
            if (!err && docs) {
                orders.remove({player_name: order.player_name, form_id: order.form_id});
            }
            order.form_id = doc._id;
            orders.save(order);
        });

        /* Take them back to the done message page */
        res.redirect('/submitted');

    });
});

module.exports = router;
