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
            console.log('docs: ', docs);
            docs.sort(function(a, b) {
                if (a.team === b.team) {
                    // Sort by last name
                    // TODO: Store first and last name separately in DB
                    a_last_name = a.player_name.
                        substring(a.player_name.indexOf(' ') + 1);
                    b_last_name = b.player_name.
                        substring(b.player_name.indexOf(' ') + 1);
                    return a_last_name > b_last_name;
                }
                return a.team > b.team;
            })
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
    
});

module.exports = router;
