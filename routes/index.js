var express = require('express');
var router = express.Router();

var forms = DB.collection('forms');
var admins = DB.collection('admins');

/* GET home page. */
router.get('/', function(req, res, next) {
    admins.find({}, function(err, the_admins) {
        forms.find({}, function(err, the_forms) {
            var separated_team_forms = {};
            for (var admin of the_admins) {
                var key = admin.team;
                separated_team_forms[key] = {'team': key, 'open_forms': [], 'closed_forms': []};
            }
            for (var form of the_forms) {
                if (form.live) {
                    console.log('form.team:', form.team);
                    separated_team_forms[form.team]['open_forms'].push(form);
                } else {
                    separated_team_forms[form.team]['closed_forms'].push(form);
                }
            }
            res.render('index', {'separated_forms': separated_team_forms});
        });
    });
});

module.exports = router;
