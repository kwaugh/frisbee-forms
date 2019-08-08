global.MONGOJS = require('mongojs');
global.DB = MONGOJS('frisbee-forms_mongo_1/frisbee-forms');

var express      = require('express');
var session      = require('express-session');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var routes      = require('./routes/index');
var form        = require('./routes/form');
var admin       = require('./routes/admin');
var new_form    = require('./routes/new_form');
var edit_form   = require('./routes/edit_form');
var info        = require('./routes/info');
var form_submit = require('./routes/form_submit');
var form_delete = require('./routes/form_delete');
var form_delete_responses = require('./routes/form_delete_responses');
var select_export = require('./routes/select_export');
var export_form = require('./routes/export');
var contact_info = require('./routes/contact_info');
var delete_contacts = require('./routes/delete_all_contacts');
var clone_form = require('./routes/clone_form');
var logout      = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    cookie: {
        path    : '/',
        httpOnly: false,
    },
    secret: 'akdJklw490Jk9Q3Fjdkgnb',
    resave: false,
    saveUninitialized: false,
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/form', form);
app.use('/admin', admin);
app.use('/new_form', new_form);
app.use('/edit_form', edit_form);
app.use('/info', info);
app.use('/form_submit', form_submit);
app.use('/form_delete', form_delete);
app.use('/form_delete_responses', form_delete_responses);
app.use('/select_export', select_export);
app.use('/export', export_form);
app.use('/contact_info', contact_info);
app.use('/delete_all_contacts', delete_contacts);
app.use('/clone_form', clone_form);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
