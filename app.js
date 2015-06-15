var express = require('express'),
    app = express();

//var routes = require('./routes/index');
//var users = require('./routes/users');
//var books = require('./routes/books');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require("./config/config.js");
var exphbs = require("express-handlebars");
var expressValidator = require("express-validator");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bookclub');



// view engine setup, htlm handling and static scripts
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');
// OJO: I had to delete manually app.use(favicon)
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser()); // will assign a cookie to each session...
// will find all my static scripts (eg styles) in public folder
app.use(express.static(path.join(__dirname, 'public')));


var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    // dev specific settings
    app.use(session({secret:config.sessionSecret,
                    saveUninitialized: true,
                    resave:true}))
}else{
    // prod specific settings
    app.use(session({secret:'catscanfly',
                    saveUninitialized: true,
                    resave:true
                    }))
// see ALL the Sahim training later to find specific settings for development using a config!
// It is a bit scaterred but really good!
}

// Passport
// E: ...(and then this goes SECOND !)

//require('./auth/passportAuth.js')(passport, LocalStrategy, config, mongoose);  

app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
    }
    return {
        param : formParam,
        msg   : msg,
        value : value
    };
  }
}));

// Connect-Flash
app.use(flash());

require('./routes/index.js')(express, app);
require('./routes/users.js')(express, app, passport, LocalStrategy, mongoose);
//var books = require('./routes/books');
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
