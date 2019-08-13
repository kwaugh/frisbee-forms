var express = require('express');
var router = express.Router();

/* Contact info page. */
var names = DB.collection('names');
router.all('/', function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('admin');
        return;
    }
    names.find({}, function(err, docs) {
        docs.sort(function(a, b) {
            if (a.team == b.team) {
                // Sort by last name
                // TODO: Store first and last name separately in DB
                a_first_name = a.name.substring(0, a.name.indexOf(' '));
                b_first_name = b.name.substring(0, b.name.indexOf(' '));
                if (a_first_name > b_first_name) {
                    return 1;
                } else if (a_first_name < b_first_name) {
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
        res.render('contact_info', {'contacts': docs});
    });
});

module.exports = router;
