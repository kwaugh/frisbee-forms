var express = require('express');
var router = express.Router();

var fs = require('fs');

var orders = DB.collection('orders');
var forms = DB.collection('forms');

router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('/admin');
        return;
    }
    var form_name = req.body['form-name'];
    console.log('form-name:', form_name);
    if (!form_name || form_name === '') {
        res.redirect('/admin');
        return;
    }

    // Build the CSV string
    forms.findOne({'name': form_name}, function(err, doc) {
        if (err || !doc) {
            res.redirect('/admin');
            return;
        }

        var csv = 'Name,';
        for (var item_index in doc.items) {
            var item = doc.items[item_index];
            // console.log('item:', item);
            if (item.subitems && item.subitems.length !== 0) { // There are subitems
                for (var subitem_index in item.subitems) {
                    var subitem = item.subitems[subitem_index]; 
                    // console.log('subitem:', subitem);
                    if (subitem.sizes.length !== 0) {
                        for (var size_index in subitem.sizes) {
                            var size = subitem.sizes[size_index]; 
                            // console.log('subitem sizes');
                            csv += subitem.name + ' ' + item.name + ' ' + size + ',Number,';
                        }
                    } else { // There is no applicabale size (e.g. hats)
                         // console.log('subitem no sizes');
                        csv += subitem.name + ' ' + item.name + ',Number,';
                    }
                }
            } else { // No subitems
                if (item.sizes && item.sizes.length !== 0) {
                    for (var size_index in item.sizes) {
                        var size = item.sizes[size_index];
                        // console.log('item sizes');
                        csv += item.name + ' ' + size + ',Number,';
                    }
                } else { // There is no applicable size (e.g. hats)
                     // console.log('item no sizes');
                    csv += item.name + ',Number,';
                }
            }
        }
        // Done building the column headers
        csv += '\n';
        
        orders.find({'form_name': form_name}, function(err, docs) {
            if (err || !docs) {
                res.redirect('/admin');
                return;
            }
            // console.log('docs:', docs);
            for (var order_index in docs) {
                var order = docs[order_index];
                // console.log('order:', order); 
                csv += order.player_name + ',';
                for (var item_index in order.items) {
                    var item = order.items[item_index]; 
                    if (item.quantity == 0) {
                        csv += ',,';
                    } else {
                        csv += item.quantity + ',"' + item.numbers.toString() + '",';
                    }
                }
                csv += '\n';
            }
            console.log('csv:', csv);
            var fileName = './data_' + req.sessionId;
            fs.writeFile(fileName, csv, function(err) {
                if (err) {
                    console.log('Couldnt save the file');
                }
                res.download(fileName, form_name + '.csv', function(err) {
                    if (err) {
                        console.log('Error downloading the file');
                    }
                    // Delete the file
                    fs.unlink(fileName, function(err) {
                        if (err) {
                            console.log('Error when deleting the file');
                        }
                    });
                });
            });
        });

    });
    
    // Save the string to disk


    // Send the file to the user


    // Delete the file from disk
});

module.exports = router;
