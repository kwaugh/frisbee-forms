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
    forms.findOne({'name': form_name}, function(err, doc) {
        if (err || !doc) {
            res.redirect('/admin');
            return;
        }

        var csv = '';

        // Build the first row, which is item names (only if there are subitems)
        var has_subitems = false;
        for (var item of doc.items) {
            if (item.subitems && item.subitems.length !== 0) {
                has_subitems = true;
                break;
            }
        }

        if (has_subitems) {
            csv += ','; // Empty cell above name column
            for (var item of doc.items) {
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
        for (var item of doc.items) {
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
        
        orders.find({'form_name': form_name}, function(err, docs) {
            if (err || !docs) {
                res.redirect('/admin');
                return;
            }
            docs.sort(function(a, b) {
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
            for (var order of docs) {
                if (order.team !== last_team_name) {
                    if (last_team_name !== '') {
                        csv += '\n';
                    }
                    last_team_name = order.team;
                }
                csv += order.player_name + ',';
                for (var item of order.items) {
                    if (item.quantity == 0) {
                        csv += ',,';
                    } else {
                        csv += item.quantity + ',"' + item.numbers.toString() + '",';
                    }
                }
                csv += '\n';
            }
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

}

/* aggregated orders per item */
function export_version_2(form_name, req, res, next) {
    // Build the CSV string
    forms.findOne({'name': form_name}, function(err, doc) {
        if (err || !doc) {
            res.redirect('/admin');
            return;
        }

        var csv = '';

        // Build the first row
        csv += ',Quantity,Numbers\n';

        var aggregated_data = {};
        for (var item of doc.items) {
            if (item.subitems && item.subitems.length !== 0) { // has subitems
                for (var subitem of item.subitems) {
                    var excel_name = subitem.name + ' ' + item.name;
                    aggregated_data[excel_name] = {};
                    aggregated_data[excel_name].quantity = 0;
                    for (var size of subitem.sizes) {
                        aggregated_data[excel_name][size] = {
                            'quantity': 0,
                            'numbers': []
                        };
                    }
                }
            } else { // no subitems
                aggregated_data[item.name] = {};
                aggregated_data[item.name].quantity = 0;
                for (var size of item.sizes) {
                    aggregated_data[item.name][size] = {
                        'quantity': 0,
                        'numbers': []
                    };
                }
            }
        }
        // built aggregated_data. time to populate it

        orders.find({'form_name': form_name}, function(err, docs) {
            // grab the quantity and numbers from each
            // store in aggregated_data
            for (var doc of docs) {
                for (var item of doc.items) {
                    var split_name = item.name.split('-');
                    if (split_name.length == 3) { // there are subitems
                        var main_name = split_name[0];
                        var sub_name = split_name[1];
                        var size = split_name[2];

                        var sanitized_quantity = isNaN(parseInt(item.quantity)) ? 0 : parseInt(item.quantity);
                        aggregated_data[sub_name + ' ' + main_name][size].quantity += sanitized_quantity;
                        aggregated_data[sub_name + ' ' + main_name].quantity += sanitized_quantity;
                        aggregated_data[sub_name + ' ' + main_name][size].numbers = aggregated_data[sub_name + ' ' + main_name][size].numbers.concat(item.numbers);
                    } else if (split_name.length == 2) { // no subitems
                        var main_name = split_name[0];
                        var size = split_name[1];

                        var sanitized_quantity = isNaN(parseInt(item.quantity)) ? 0 : parseInt(item.quantity);
                        aggregated_data[main_name][size].quantity += sanitized_quantity;
                        aggregated_data[main_name].quantity += sanitized_quantity;
                        aggregated_data[main_name][size].numbers = aggregated_data[main_name][size].numbers.concat(item.numbers);
                    } else {
                    }
                }
            }
            // aggregated data is populated. time to generate csv
            for (var item in aggregated_data) {
                if (aggregated_data.hasOwnProperty(item)) {
                    if (aggregated_data[item].hasOwnProperty('')) { // no sizes for this item
                        csv += item + ',' + aggregated_data[item][''].quantity + ',';
                        csv += '"' + aggregated_data[item][''].numbers.sort().toString() + '"';
                        csv += '\n';
                    } else { // there are sizes
                        csv += item + '\n';
                        for (var size in aggregated_data[item]) {
                            if (aggregated_data[item].hasOwnProperty(size) && size !== 'quantity') {
                                csv += size + ',';
                                csv += aggregated_data[item][size].quantity + ',';
                                csv += '"' + aggregated_data[item][size].numbers.sort().toString() + '"';
                                csv += '\n';
                            }
                        }
                        csv += 'Total,' + aggregated_data[item].quantity.toString() + '\n';
                    }
                }
            }

            // download the new file
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

}

module.exports = router;
