var express = require('express');
var router = express.Router();

/* Form page */
router.all('/', function(req, res, next) {
    if (!valid_index_form(req)) {
        res.redirect('/');
    } else {
        res.render('form', { title: 'Jersey/Shorts Order Form' , names: [] });
    }
});

function valid_index_form(req) {
    var number = req.param('default-jersey-number');
    var select_name = req.param('select-name');
    var textbox_name = req.param('textbox-name');
    console.log('number:', number);
    console.log('select_name:', select_name);
    console.log('textbox_name:', textbox_name);
    return number && (select_name || textbox_name);
}

module.exports = router;
