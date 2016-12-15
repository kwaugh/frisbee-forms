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
    var export_version = req.body['export-version'];
    var export_handlers = {
        '1': function() { export_version_1(form_name, req, res, next); },
        '2': function() { export_version_2(form_name, req, res, next); }
    };
    if (!form_name || form_name === '' || !export_version ||
        !(export_version in export_handlers))
    {
        res.redirect('/admin');
        return;
    }
    export_handlers[export_version]();
});

/* Orders for each person */
function export_version_1(form_name, req, res, next) {
    // Build the CSV string
    forms.findOne({'name': form_name}, function(err, form) {
        if (err || !form) {
            res.redirect('/admin');
            return;
        }

        var csv = '';

        // Build the first row, which is item names (only if there are subitems)
        var has_subitems = false;
        for (var item of form.items) {
            if (item.subitems && item.subitems.length !== 0) {
                has_subitems = true;
                break;
            }
        }

        if (has_subitems) {
            csv += ','; // Empty cell above name column
            for (var item of form.items) {
                if (item.subitems && item.subitems.length !== 0) {
                    csv += item.name;
                }
                for (var subitem of item.subitems) {
                    // *2 because of number columns
                    for (var i = 0; i < subitem.sizes.length * 2; i++) {
                        csv += ',';
                    }
                }
            }
            csv += '\n';
        }

        csv += 'Name,';
        for (var item of form.items) {
            if (item.subitems && item.subitems.length !== 0) { // There are subitems
                for (var subitem of item.subitems) {
                    if (subitem.sizes.length !== 0) {
                        for (var size of subitem.sizes) {
                            csv += subitem.name + ' ' + size + ',Number,';
                        }
                    } else { // There is no applicabale size (e.g. hats)
                        csv += subitem.name + ',Number,';
                    }
                }
            } else { // No subitems
                if (item.sizes && item.sizes.length !== 0) {
                    for (var size of item.sizes) {
                        csv += item.name + ' ' + size + ',Number,';
                    }
                } else { // There is no applicable size (e.g. hats)
                    csv += item.name + ',Number,';
                }
            }
        }
        // Done building the column headers
        csv += '\n';
        
        orders.find({'form_id': form._id}, function(err, the_orders) {
            if (err || !the_orders) {
                res.redirect('/admin');
                return;
            }
            the_orders.sort(function(a, b) {
                if (a.team == b.team) {
                    // Sort by last name
                    // TODO: Store first and last name separately in DB
                    a_last_name = a.player_name.
                        substring(a.player_name.indexOf(' ') + 1);
                    b_last_name = b.player_name.
                        substring(b.player_name.indexOf(' ') + 1);
                    if (a_last_name > b_last_name) {
                        return 1;
                    } else if (a_last_name < b_last_name) {
                        return -1;
                    }
                    return 0;
                }
                if (a.team > b.team) {
                    return 1;
                } else if (a.team < b.team) {
                    return -1;
                }
                return 0;
            });
            var last_team_name = '';
            for (var order of the_orders) {
                if (order.team !== last_team_name) {
                    if (last_team_name !== '') {
                        csv += '\n';
                    }
                    last_team_name = order.team;
                }
                csv += order.player_name + ',';
                // TODO: fix so that order doesn't matter
                for (var item of order.items) {
                    if (item.quantity == 0) {
                        csv += ',,';
                    } else {
                        csv += item.quantity + ',"' + item.numbers.toString() + '",';
                    }
                }
                csv += '\n';
            }
            saveFile('./data_' + req.sessionId, form_name, csv, res);
        });

    });

}

/* aggregated orders per item */
function export_version_2(form_name, req, res, next) {
    // Build the CSV string
    forms.findOne({'name': form_name}, function(err, form) {
        if (err || !form) {
            res.redirect('/admin');
            return;
        }

        var csv = '';

        // Build the first row
        csv += ',Quantity,Numbers\n';

        var id_to_name = {};

        var aggregated_data = {'quantity': 0};
        for (var item of form.items) {
            if (item.subitems && item.subitems.length !== 0) { // has subitems
                for (var subitem of item.subitems) {
                    id_to_name[subitem.subitem_id] = item.name + ' ' + subitem.name;
                    aggregated_data[subitem.subitem_id] = {quantity: 0};
                    for (var size of subitem.sizes) {
                        aggregated_data[subitem.subitem_id][size] = {
                            'quantity': 0,
                            'numbers': []
                        };
                    }
                }
            } else { // no subitems
                id_to_name[item.item_id] = item.name;
                aggregated_data[item.item_id] = {quantity: 0};
                for (var size of item.sizes) {
                    aggregated_data[item.item_id][size] = {
                        'quantity': 0,
                        'numbers': []
                    };
                }
            }
        }
        // built aggregated_data. time to populate it

        orders.find({'form_id': form._id}, function(err, the_orders) {
            // grab the quantity and numbers from each
            // store in aggregated_data
            for (var order of the_orders) {
                for (var item of order.items) {
                    var sanitized_quantity = isNaN(parseInt(item.quantity))
                        ? 0 : parseInt(item.quantity);
                    aggregated_data[item.id][item.size].quantity += sanitized_quantity;
                    aggregated_data[item.id].quantity += sanitized_quantity;
                    aggregated_data.quantity += sanitized_quantity;
                    aggregated_data[item.id][item.size].numbers =
                        aggregated_data[item.id][item.size].  numbers.concat(item.numbers);
                }
            }
            // aggregated data is populated. time to generate csv
            for (var item in aggregated_data) {
                var item_name = id_to_name[item];
                if (aggregated_data.hasOwnProperty(item) && item !== 'quantity') {
                    if (aggregated_data[item].hasOwnProperty('')) { // no sizes for this item
                        csv += item_name + ',' + aggregated_data[item][''].quantity + ',';
                        csv += '"' + aggregated_data[item][''].numbers.sort().toString() + '"';
                        csv += '\n';
                    } else { // there are sizes
                        csv += item_name + '\n';
                        for (var size in aggregated_data[item]) {
                            if (aggregated_data[item].hasOwnProperty(size) && size !== 'quantity') {
                                csv += size + ',';
                                csv += aggregated_data[item][size].quantity + ',';
                                if (aggregated_data[item][size].numbers.length !== 0) {
                                    aggregated_data[item][size].numbers.sort();
                                }
                                csv += '"' + aggregated_data[item][size].numbers.toString() + '"';
                                csv += '\n';
                            }
                        }
                        csv += 'Total,' + aggregated_data[item].quantity.toString() + '\n';
                    }
                }
            }
            csv += '\n' + 'Total,' + aggregated_data.quantity + '\n'

            // download the new file
            saveFile('./data_' + req.sessionId, form_name, csv, res);
        });

    });

}

function saveFile(fileName, formName, csv, res) {
    fs.writeFile(fileName, csv, function(err) {
        if (err) {
            console.log('Couldnt save the file');
        }
        res.download(fileName, formName + '.csv', function(err) {
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
}

module.exports = router;
