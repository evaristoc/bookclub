module.exports = function(express, app, passport, LocalStrategy, mongoose){
    var userrouter = express.Router();
    var User = require('../models/User.js');
    var Book = require('../models/Book.js');

    /* GET users listing. */
    // Anyone is a user BEFORE and even AFTER signing
    // Someone requesting the signup from the index view file in the users folder will be showed the page
    // FIRST OF ALL: SIGNUP !!! Otherwise I cannot visit the user folder...
    //router.get('/signup/newsignup', function(err, req, res, next) {
    //  if (err) throw err;
    //  res.render('newsignup', { title: 'Signup Form' });
    //});
 
    // userrouter.get("/", function(req, res, next) {
    //    res.render("index", {title:"User Dashboard Route"})
    //})
    
    userrouter.get('/user/signup', function(req, res, next) {
      res.render('user/signup', { title: 'About BookClub' });
    });

    userrouter.post('/user/signup', function(req, res, next){
        // Get Form Values
        var name         	= req.body.name;
        var email    		= req.body.email;
        var username 		= req.body.username;
        var password 		= req.body.password;
        var password2 		= req.body.password2;
    
        // Form Field Validation
            // E: only for empty field...
        req.checkBody('name', 'Name field is required').notEmpty();
        req.checkBody('email', 'Email field is required').notEmpty();
        req.checkBody('email', 'Email must be a valid email address').isEmail();
        req.checkBody('username', 'Username field is required').notEmpty();
        req.checkBody('password', 'Password field is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    
        var errors = req.validationErrors();
    
            //E: if error, re-render all in signup page, even the error...
        if(errors){
            res.render('user/signup', {
                errors: errors,
                name: name,
                email: email,
                username: username,
                password: password,
                password2: password2
            });
            // E: if no error, create a new User
            // E: if the user is a student, create Student
            // E: if the user is a instructor, create Instructor
        } else {
            var newUser = new User({
                name: name,
                email: email,
                username:username,
                password:password
            });
            console.log(typeof newUser);
            console.log(typeof User);
            // E: checking the type of application: student or instructor
            User.createUser(newUser, function(err, user){
                // E: final message into the web server and redirecting to homepage
                if (err) throw err;
                console.log(user);
                req.flash('success','user added');
                res.redirect('/');
            });
        }
    });
    
    //// In the following, some preliminary steps are taken to start a session:
    //// --- A temporary session cookie serialised by passport
    //// --- AFTER INIT SERIALIZATION!!, the authentication of a login can be carried out
    //

    // Training: passport implementation
    // SEE http://passportjs.org/docs/configure
    // E: serialization is about creating a cookie assigned to a user to identify his/her session
    
    // HOW do I GET user in the session ???
    // 1) the passport is initialised at app.js
    // 2) here is the passport strategy then called; the strategy evaluate the data with the model (User) calling its methods
    //    passport will take the values inside the local strategy for further use
    //    so far only the compared values are not visible; no access to data is still performed
    // 3) once the comparison is valid, passport will serialize the id or any relevant look-up attribute
    // 4) after serialize, it will deserialize it again: it is here where the data is extracted !!!
    // 5) now all the info about the record is accessible and rendered (--> done(err, user))
    //    the record is available to the whole local script
    
    passport.use(new LocalStrategy(
       function(username, password, done){
              console.log('user in passport LocalStrategy 1 ');
               User.getUserByUsername(username, function(err, user){
               if(err) throw err;
               if(!user){
                   console.log('Unknown User');
                   return done(null, false,{message: 'Unknown User'});
               }
   
               User.comparePassword(password, user.password, function(err, isMatch){
                   if(err) throw err;
                   if(isMatch){
                       console.log('user in passport LocalStrategy 2 ');
                       return done(null, user);
                   } else {
                       console.log('Invalid Password');
                       return done(null, false, {message:'Invalid Password'});
                   }
               });
           });
       }
   ));

    passport.serializeUser(function(user, done) {
      console.log('user in passport.serializeUser ');
      console.log(user);
      done(null, user._id);
    });
    
    passport.deserializeUser(function(id, done) {
      console.log(id);
      User.getUserById(id, function(err, user) {
        console.log('user in passport.deserializeUser -> User.getUserById ');
        console.log(user);
        done(err, user);
      });
    });



    //
    // Here the login:
    // --- start from login partials,
    // --- verify the correct authentication (which include decrypting at the Model file)
    // --- after requesting (and sending...) some data for messaging and redirection...
    // --- ... redirect the person into the corresponding section
    
    userrouter.post('/login', passport.authenticate('local',{failureRedirect:'/', failureFlash:'Invalid username or password'}), function(req, res){
        console.log('Authentication Successful');
        console.log('user in post after login and authentication ');
        var username = req.user.username;
        req.flash('success', 'You are logged in');
        res.redirect('/books/index');
    });

    function ensureAuthenticated(req,res,next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/')
    }


    // THIS ROUTER IS FOR GOING INTO BOOKS INDEX AFTER LOGIN
    // THE ROUTER REQUIRES AUTHENTICATION !!!
    userrouter.get('/books/index', ensureAuthenticated, function(req, res, next) {
        // here is where the new created method of object Student is initialised !!
        User.getUserById(req.user.id, function(err,user){
          console.log('user in router to book ');
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            console.log(user.username);
            res.render('user/books/index', {'user':user.username}); // the second parameter is session and its name!!
          }
        });
      }
    );

///////////////////////////////////////////////////////////////////////////////

  
    
    //// THIS ROUTER IS FOR GOING INTO PROFILES TO SEE PROFILE
    //// THE ROUTER REQUIRES AUTHENTICATION !!!
    //userrouter.get('/user/profile', ensureAuthenticated, function(req, res, next) {
    //    // here is where the new created method of object Student is initialised !!
    //    User.getUserById(req.user.id, function(err,user){
    //      console.log('user in router to profile ');
    //      if (err) {
    //        console.log(err);
    //        res.send(err);
    //      } else {
    //        console.log(user.username);
    //        res.render('user/profile', {'user':user}); // the second parameter is session and its name!!
    //      }
    //    });
    //  }
    //);


    // THIS ROUTER IS FOR GOING INTO A NEW BOOK
    // THE ROUTER REQUIRES AUTHENTICATION !!!
    userrouter.get('/user/books/new', ensureAuthenticated, function(req, res, next) {
        // here is where the new created method of object Student is initialised !!
        User.getUserById(req.user.id, function(err,user){
          console.log('user in router to book new ');
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            console.log(user.username);
            res.render('user/books/new', {'user':user}); // the second parameter is session and its name!!
          }
        });
      }
    );


    userrouter.post('/user/books/new', ensureAuthenticated, function(req, res, next){
        // Get Form Values
        console.log("inside post new book level 1");
        console.log('Owner of Book ',req.user._id);
        var title         	= req.body.title;
        var authors    		= req.body.authors;
        var edition 		= req.body.edition;
        var remarks 		= req.body.remarks;
        var newBook = new Book({
                title: title,
                authors: authors,
                edition:edition,
                remarks:remarks,
                _owner:req.user._id,
                status:""
        });
        // this transaction could occur, but there is less than granted!! one of the issues with no-SQL
        //mongoose update array
        //http://tech-blog.maddyzone.com/node/add-update-delete-object-array-schema-mongoosemongodb
        //http://justinklemm.com/node-js-async-tutorial/
        //http://stackoverflow.com/questions/17647112/how-do-you-update-one-to-many-relationships-in-node-js
        //http://jaketrent.com/post/mongoose-population/
        //user.b_idsave = function(bid){req.user.updatebooks.push(bid); user.save;}
        //console.log('Owner Assigned to Book ',newBook._owner);
        //Book.createBook(newBook, req.user, User, function(err, req, res, next){
        //  if (err) return next(err);
        //  res.render('user/books/new', {'user':user});
        //});
        Book.createBook(newBook, req.user, User);
        //Book.createBook(newBook, req.user, User, console.log('callback'));
        //Book.createBook(newBook, req.user, User, function(err, user, book){
        //    req.flash('success','book added');
        //    res.redirect('/user/profile');            
        //});
        //test_func = function(){console.log('TEST')};
        ////Book.createBook(newBook, test_func(), function(err, book){
        ////    // E: final message into the web server and redirecting to homepage
        ////    if (err){
        ////      res.send(err)
        ////    }else{
        ////      console.log(user, book);
        ////      req.flash('success','book added');
        ////      res.redirect('user/profile');
        ////    };
        ////});
        //Book.createBook(newBook, test_func(), function(){
        //    // E: final message into the web server and redirecting to homepage
        //      //console.log(req.user, book);
        //      //req.flash('success','book added');
        //      res.redirect('/user/profile');
        //});
    });


    // THIS ROUTER IS FOR GOING INTO PROFILES TO SEE PROFILE
    // THE ROUTER REQUIRES AUTHENTICATION !!!
    userrouter.get('/user/profile', ensureAuthenticated, function(req, res, next) {
        // here is where the new created method of object Student is initialised !!
        User.getUserById(req.user.id, function(err,user){
          console.log('user in router to profile ');
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            console.log(user.username);
            res.render('user/profile', {'user':user}); // the second parameter is session and its name!!
          }
        });
      }
    );


    userrouter.get('/logout', function(req, res){
        req.logout();
            // Success Message
        req.flash('success','You have logged out');
        res.redirect('/');
    });	

    ///////////////////////////////////////////////


    //
    //// USE THIS PART TO REGISTER NEW BOOKS
    //router.post('user/books/new', function(req,res){
    //    // filled with the info passed through the form
    //    info = [];
    //    info['username'] = req.user.username;
    //    //console.log(req.body.class_id);
    //    info['class_id'] = req.body.class_id;
    //    info['class_title'] = req.body.class_title;
    //    
    //    User.register(info, function(err, user){
    //        if (err) throw err;
    //        console.log(user);
    //    });
    //    req.flash('success', 'You have registered a new book');
    //    res.redirect('/user/books');
    //})
    


    
    
    //// Once in the signup pages, the page will obtain the info, validate it, check for errors and show responses accordingly
    //// When the data is ready, will be saved in the User as well as in Student/Instructor models and it will go to the home page
    //router.post('/newsignup', function(req, res, next){
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
    app.use('/', userrouter);

}