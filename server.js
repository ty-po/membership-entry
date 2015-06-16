var express     = require('express');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var passport    = require('passport');

var config      = require('./app/config.js');

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var auth = require('./app/ctrl.js').Auth;
auth.strategy();
app.use(passport.initialize());

var db = require('./app/db.js');
db.connect()

var routes = require('./app/routes.js');
app.use('/', routes);

var error = require('./app/error.js');
app.use(error.message);

console.log('Open on ' + config.port);
app.listen(config.port);
