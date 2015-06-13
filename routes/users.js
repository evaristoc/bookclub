module.exports = function(express, app){
    var router = express.Router();
    var User = require('../models/User');
    
    /* GET users listing. */
    router.get('/', function(req, res, next) {
      res.send('respond with a resource');
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
            res.render('/home', {'users':user}); // the second parameter is session !!
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

    app.use('/', users);

}