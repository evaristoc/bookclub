module.exports = function(express, app, passport, LocalStrategy){
    var router = express.Router();
    var User = require('../models/User');

    /* GET users listing. */
    // Anyone is a user BEFORE and even AFTER signing
    // Someone requesting the signup from the index view file in the users folder will be showed the page
    // FIRST OF ALL: SIGNUP !!! Otherwise I cannot visit the user folder...
    router.get('/newsignup', function(err, req, res, next) {
      if (err) throw err;
      res.render('/signup/signupnew');
    });
    
    function ensureAuthenticated(req,res,next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/')
    }
    
    // USE THIS PART TO TAKE THE AUTHENTICATED USERS TO SEE A COMMON VIEW OF INFORMATION ABOUT THE SITE
    router.get('/', ensureAuthenticated, function(req, res, next) {
        // here is where the new created method of object Student is initialised !!
        User.getUserById(req.user.id, function(err,id){
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            res.render('/user', {'users':User}); // the second parameter is session and its name!!
          }
        });
      }
    );
    
    // USE THIS PART TO REGISTER NEW BOOKS
    router.post('user/books/new', function(req,res){
        // filled with the info passed through the form
        info = [];
        info['username'] = req.user.username;
        //console.log(req.body.class_id);
        info['class_id'] = req.body.class_id;
        info['class_title'] = req.body.class_title;
        
        User.register(info, function(err, user){
            if (err) throw err;
            console.log(user);
        });
        req.flash('success', 'You have registered a new book');
        res.redirect('/user/books');
    })
    

    ///////////////////////////////////////////////
    
    
    //// Once in the signup pages, the page will obtain the info, validate it, check for errors and show responses accordingly
    //// When the data is ready, will be saved in the User as well as in Student/Instructor models and it will go to the home page
    //router.post('/new', function(req, res, next){
    //    // Get Form Values
    //    var first_name     	= req.body.first_name;
    //    var last_name     	= req.body.last_name;
    //    var street_address  = req.body.street_address;
    //    var city     		= req.body.city;
    //    var state    		= req.body.state;
    //    var zip     		= req.body.zip;
    //    var email    		= req.body.email;
    //    var username 		= req.body.username;
    //    var password 		= req.body.password;
    //    var password2 		= req.body.password2;
    //    var type            = req.body.type;
    //
    //    // Form Field Validation
    //        // E: only for empty field...
    //    req.checkBody('first_name', 'First name field is required').notEmpty();
    //    req.checkBody('last_name', 'Last name field is required').notEmpty();
    //    req.checkBody('email', 'Email field is required').notEmpty();
    //    req.checkBody('email', 'Email must be a valid email address').isEmail();
    //    req.checkBody('username', 'Username field is required').notEmpty();
    //    req.checkBody('password', 'Password field is required').notEmpty();
    //    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    //
    //    var errors = req.validationErrors();
    //
    //        //E: if error, re-render all in signup page, even the error...
    //    if(errors){
    //        res.render('user/signup/new', {
    //            errors: errors,
    //            first_name: first_name,
    //            last_name: last_name,
    //            street_address: street_address,
    //            city: city,
    //            state: state,
    //            zip: zip,
    //            email: email,
    //            username: username,
    //            password: password,
    //            password2: password2
    //        });
    //        // E: if no error, create a new User
    //        // E: if the user is a student, create Student
    //        // E: if the user is a instructor, create Instructor
    //    } else {
    //        var newUser = new User({
    //            first_name: first_name,
    //            last_name: last_name,
    //            address: [{
    //                street_address: street_address,
    //                city: city,
    //                state: state,
    //                zip: zip
    //            }],
    //            email: email,
    //            username:username
    //        });
    //        // E: checking the type of application: student or instructor
    //        User.saveUser(newUser, newStudent, function(err, user){
    //            // E: final message into the web server and redirecting to homepage
    //            req.flash('success','User added');
    //            res.redirect('/user/books/index');
    //        });
    //    }
    //});
    //
    //// In the following, some preliminary steps are taken to start a session:
    //// --- A temporary session cookie serialised by passport
    //// --- AFTER INIT SERIALIZATION!!, the authentication of a login can be carried out
    //
    //// Training: passport implementation
    //// SEE http://passportjs.org/docs/configure
    //// E: serialization is about creating a cookie assigned to a user to identify his/her session
    //passport.serializeUser(function(user, done) {
    //  done(null, user._id);
    //});
    //
    //passport.deserializeUser(function(id, done) {
    //  User.getUserById(id, function(err, user) {
    //    done(err, user);
    //  });
    //});
    //
    //
    //// Here the login:
    //// --- start from login partials,
    //// --- verify the correct authentication (which include decrypting at the Model file)
    //// --- after requesting (and sending...) some data for messaging and redirection...
    //// --- ... redirect the person into the corresponding section
    //
    //// E: also from the other project, modified...
    //router.post('/login', passport.authenticate('local',{failureRedirect:'/', failureFlash:'Invalid username or password'}), function(req, res){
    //    console.log('Authentication Successful');
    //    var usertype = req.user.type;
    //        req.flash('success', 'You are logged in');
    //    res.redirect('/user/books/index');
    //});
    //
    //
    //// Here ANOTHER case of callback effect: the passport object is asked to use local strategy and set for errors AFTER it is actually used (above)
    //passport.use(new LocalStrategy(
    //    function(username, password, done){
    //            User.getUserById(username, function(err, user){
    //            if(err) throw err;
    //            if(!user){
    //                console.log('Unknown User');
    //                return done(null, false,{message: 'Unknown User'});
    //            }
    //
    //            User.comparePassword(password, user.password, function(err, isMatch){
    //                if(err) throw err;
    //                if(isMatch){
    //                    return done(null, user);
    //                } else {
    //                    console.log('Invalid Password');
    //                    return done(null, false, {message:'Invalid Password'});
    //                }
    //            });
    //        });
    //    }
    //));
    //
    //// Training: logout is just a page that will come back to login after a flash message
    //router.get('/logout', function(req, res){
    //    req.logout();
    //        // Success Message
    //    req.flash('success','You have logged out');
    //    res.redirect('/');
    //});	
    //
    ////E:let people only go to a route only if they are loggin, otherwise they redirect to login page again
    //function ensureAuthenticated(req,res,next) {
    //  if (req.isAuthenticated()) {
    //    return next();
    //  }
    //  res.redirect('/')
    //}
    


    // E: the second parameter is the Object !
    // http://stackoverflow.com/questions/18296184/error-creating-user-in-express-routes-file
    app.use('/user', User);

}