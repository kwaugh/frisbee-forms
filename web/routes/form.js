var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');
var names = DB.collection('names');
var orders = DB.collection('orders');

/* User page for filling out forms */
router.all('/', function(req, res, next) {
    var form = req.body.form;
    var textbox_firstname = req.body['textbox-firstname'] ?
        req.body['textbox-firstname'].trim() : '';
    var textbox_lastname = req.body['textbox-lastname'] ?
        req.body['textbox-lastname'].trim() : '';
    var select_name = req.body['select-name'];
    var jersey_number = req.body['default-jersey-number'];
    var team = req.body.team;
    var phone = req.body.phone;
    var email = req.body.email;
    if (!isValidForm(form, textbox_firstname, textbox_lastname, select_name,
            jersey_number, team, phone, email)) {
        res.redirect('/');
        return;
    }
    var textbox_name = textbox_firstname.charAt(0).toUpperCase() +
    textbox_firstname.slice(1) + ' ' + textbox_lastname.charAt(0).toUpperCase() +
    textbox_lastname.slice(1);
    var name = '';
    /* Default to select name if it is filled out */
    if (select_name && select_name !== null && select_name !== 'Custom') {
        name = select_name;
    } else {
        name = textbox_name;
    }
    name = name.trim();
    // Add jersey number and team to player name
    names.findOne({'name': name}, function(err, db_form) {
        if ((err || !db_form || db_form === '') && name !== '') {
            // Save their preferred number
            names.save({
                'name': name,
                'number': jersey_number,
                'team': team,
                'phone': phone,
                'email': email
            });
        } else {
            names.update(db_form, {
                'name': name,
                'number': jersey_number,
                'team': team,
                'phone': phone,
                'email': email
            });
        }
    });
    forms.findOne({name: form}, function(err, form) {
        if (err || !form || form.length === 0) {
            res.redirect('/');
            return;
        }
        var close_date = new Date(form.date);
        var can_submit = Date.now() < close_date || req.session.admin;
        orders.findOne({player_name: name, form_id: form._id}, function(err, order){
            if (err || !order) {
                order = {};
            }
            res.render('fill_form', {
                'title': form.name + ' Order Form',
                'form': form,
                'default_number': jersey_number,
                'name': name,
                'team': team,
                'team_id': form.team_id,
                'order': order,
                'can_submit': can_submit,
                'close_date': close_date.toString()
            });
        });
    });
    
});

function isValidForm(form, textbox_firstname, textbox_lastname, select_name,
        jersey_number, team, phone, email) {
    return (form && form !== null && ((
            textbox_firstname && textbox_firstname !== null &&
            textbox_lastname && textbox_lastname !== null) ||
            (select_name && select_name !== null)) &&
            jersey_number && jersey_number !== null &&
            team && team !== null &&
            phone && phone !== null &&
            email && email !== null);
}

module.exports = router;
