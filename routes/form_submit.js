var express = require('express');
var router = express.Router();

var orders = DB.collection('orders');
var forms = DB.collection('forms');

/* Page to validate user form submissions */
router.all('/', function(req, res, next) {
    console.log('req.body:', req.body);
    if (!req.body['form-name']) {
        res.redirect('/');
        return;
    }
    var order = {form_name: req.body['form-name'], team: req.body['team'],
        items: []};
    var item_num = -1;
    console.log('req.body:', req.body);
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

    console.log('order:', order);
    forms.findOne({name: order.form_name}, function(err, doc) {
        if (err || !doc) {
            res.redirect('/');
            return;
        }
        var close_date = new Date(doc.date);
        // The form is closed
        if (Date.now() > close_date) {
            res.redirect('/');
            return;
        }
        orders.findOne({player_name: order.player_name}, function(err, doc) {
            if (!err && doc) {
                orders.remove(doc);
            }
            orders.save(order);
        });

        /* Take them back to the done message page */
        res.redirect('/submitted');

    });
});

module.exports = router;
