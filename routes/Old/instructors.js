var express = require('express');
var router = express.Router();

// E: calling the models
Class = require('../models/class');
Instructor = require('../models/instructor');
//User = require('../models/user');

/* getting the classes the user is registered */
/* because the setting of the mongoDB id's at user AND student collections are different!!
   therefore the username is used instead...
*/
// we will be using the global defined user variable to extract the data !!!
// from the views at /classes folder, ensure authentication and if no error take instructors to the instructors sections
router.get('/classes', ensureAuthenticated, function(req, res, next) {
    // here is where the new created method of object Student is initialised !!
    Instructor.getInstructorByUsername(req.user.username, function(err,instructor){
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.render('instructors/classes', {'instructor':instructor});
      }
    });
  }
);


// if someone is new and register as instructor, post the data into the Instructor class a take directly to the instructor section
router.post('/classes/register', function(req,res){
    // filled with the info passed through the form
    info = [];
    info['instructor_username'] = req.user.username;
    //console.log(req.body.class_id);
    info['class_id'] = req.body.class_id;
    info['class_title'] = req.body.class_title;
    
    Instructor.register(info, function(err, instructor){
        if (err) throw err;
        console.log(instructor);
    });
    req.flash('success', 'You are teaching');
    res.redirect('/instructors/classes');
})

// this is THE CALLBACK EFFECT!! the authentication function is defined AFTER the calling function (above) without problem...
function ensureAuthenticated(req,res,next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/')
}


module.exports = router;