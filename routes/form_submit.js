var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

var orders = DB.collection('orders');
var forms = DB.collection('forms');

/* Page to validate user form submissions */
router.all('/', function(req, res, next) {
    if (!req.body['form-id']) {
        res.redirect('/');
        return;
    }
    var form_id = req.body['form-id'];
    var order = {team: req.body['team'], items: []};
    var item_num = -1;
    for (var key in req.body) {
        if (key.indexOf('name') === 0) {
            order.player_name = req.body[key]; 
        } else if (key.indexOf('quantity') === 0) {
            var id_start_pos = key.indexOf('\-', key.indexOf('\-') + 1);
            var id = ObjectID(key.substring(id_start_pos + 1));
            var size = key.substring(key.indexOf('\-') + 1, id_start_pos);
            var quantity = req.body[key];
            var item = {'id': id, 'size': size, 'quantity': quantity, numbers: []};
            order.items.push(item);
            item_num++;
        } else if (key.indexOf('number') === 0) {
            order.items[item_num].numbers.push(req.body[key]);
        }
    }

    forms.findOne({'_id': ObjectID(form_id), team: req.session.team}, function(err, doc) {
        if (err || !doc) {
            res.redirect('/');
            return;
        }
        if (Date.now() > new Date(doc.date) || !doc.live) {
            res.redirect('/'); // the form is closed
            return;
        }
        order.form_id = doc._id;
        orders.find({player_name: order.player_name, form_id: order.form_id}, function(err, docs) {
            if (!err && docs) {
                orders.remove({player_name: order.player_name, form_id: order.form_id}, function() {
                    orders.save(order);
                });
            } else {
                orders.save(order);
            }
        });

        /* Take them back to the done message page */
        res.redirect('/submitted');

    });
});

module.exports = router;
