var express = require('express'),
    app = express();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require("./config/config.js");
var ConnectMongo = ("mongodb"); // no connection to external yet...
var exphbs = require("express-handlebars");
var expressValidator = require("express-validator");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;

var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    // dev specific settings
    app.use(session({secret:config.sessionSecret}))
}else{
    // prod specific settings
    app.use(session({secret:'catscanfly'}))
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');
// OJO: I had to delete manually app.use(favicon)
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// will find all my static scripts (eg styles) in public folder
app.use(express.static(path.join(__dirname, 'public')));


var routes = require('./routes/index.js')(express, app);
//var users = require('./routes/users');
//app.use('/', routes);
//app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
