var express = require('express');
var router = express.Router();

var orders = DB.collection('orders');

/* Page to validate user form submissions */
router.all('/', function(req, res, next) {
    console.log('req.body:', req.body);
    var order = {name: '', items: []};
    var item_num = -1;
    for (var key in req.body) {
        if (key.indexOf('name') === 0) {
            order.name = req.body[key]; 
        } else if (key.indexOf('quantity') === 0) {
            if (req.body[key] == 0) continue; // Skip order with quantity === 0
            var name = key.substring(key.indexOf('-') + 1);
            var quantity = req.body[key];
            var item = {'name': name, 'quantity': quantity, sizes: []};
            order.items.push(item);
            item_num++;
        } else if (key.indexOf('number') === 0) {
            order.items[item_num].sizes.push(req.body[key]);
        }
    }
    console.log('order:', order);
    orders.save(order);

    /* Take them back to the done message page */
    res.redirect('/submitted');
});

module.exports = router;
