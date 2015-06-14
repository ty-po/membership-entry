var express     = require('express');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));

var db = require('./app/db.js');
db.connect()

var routes = require('./app/routes.js');
app.use('/', routes);

var error = require('./app/error.js');
app.use(error.message);

app.listen(3000);
