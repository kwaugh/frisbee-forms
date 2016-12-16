var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

var orders = DB.collection('orders');

/* Page to validate user form submissions */
router.all('/', function(req, res, next) {
    if (!validateParams(req, ['team', 'form-id'])) {
        res.render('form_submit_error', {error_message: ''});
        return;
    }
    DB.collection('admins').findOne({team: req.body['team']}, function(err, admin) {
        if (err || !admin) {
            res.render('form_submit_error', {error_message: 'Couldn\'t find admin.'});
            return;
        }
        var form_id = req.body['form-id'];
        var order = {team_id: admin._id, items: []};
        var item_num = -1;
        for (var key in req.body) {
            if (key.indexOf('name') === 0) {
                order.player_name = req.body[key];
            } else if (key.indexOf('quantity') === 0) {
                var id_start_pos = key.indexOf('-', key.indexOf('-') + 1);
                var id = ObjectID(key.substring(id_start_pos + 1));
                var size = key.substring(key.indexOf('-') + 1, id_start_pos);
                var quantity = req.body[key];
                var item = {'id': id, 'size': size, 'quantity': quantity, numbers: []};
                order.items.push(item);
                item_num++;
            } else if (key.indexOf('number') === 0) {
                order.items[item_num].numbers.push(req.body[key]);
            }
        }

        DB.collection('forms').findOne({'_id': ObjectID(form_id), team_id: admin._id},
                function(err, form) {
            if (err || !form) {
                console.log('db error');
                console.log('admin:', admin);
                console.log('team_id:', admin._id);
                console.log('form_id:', form_id);
                res.render('form_submit_error', {error_message: ''});
                return;
            }
            if (Date.now() > new Date(form.date) || !form.live) {
                console.log('date error');
                res.redirect('form_submit_error',
                        {error_message: 'You cannot submit an order for a closed form.'}
                        ); // the form is closed
                return;
            }
            order.form_id = form._id;
            orders.find({player_name: order.player_name, form_id: order.form_id},
                    function(err, the_orders) {
                if (!err && the_orders) {
                    orders.remove({player_name: order.player_name, form_id: order.form_id},
                        function() { orders.save(order); });
                } else {
                    orders.save(order);
                }
            });

            /* Take them back to the done message page */
            res.render('submitted');
        });
    });
});

module.exports = router;

function validateParams(req, paramsList) {
    if (!req.body || req.body === null || req.body == {})
        return false;
    for (var param of paramsList) {
        var current = req.body[param];
        if (current === undefined || current === '') {
            console.log('validateParams failed on param:', param);
            return false;
        }
    }
    return true;
}
