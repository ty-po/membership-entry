var express = require('express');
var morgan = require('morgan');

var app = express();
app.use(morgan('dev'));

var db = require('./app/db.js');
db.connect()

var routes = require('./app/routes.js');
app.use('/', routes);

app.listen(3000);
