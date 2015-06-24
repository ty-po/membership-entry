var express     = require('express');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var passport    = require('passport');

var config      = require('./app/config.js');

var app = express();
if (app.settings.env == 'development') {
  app.use(morgan('dev'));
}
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var auth = require('./app/ctrl.js').Auth;
auth.strategy();
app.use(passport.initialize());

//console.log('-- ' + app.settings.env + ' mode --')

var db = require('./app/db.js');
if (app.settings.env != 'test') {
  db.connect(app.settings.env);
}

var routes = require('./app/routes.js');
app.use('/', routes);

var error = require('./app/error.js');
app.use(error.message);

if (app.settings.env != 'test') {
  console.log('Open on ' + config.port[app.settings.env]);
  app.listen(config.port[app.settings.env]);
}

module.exports = app;
