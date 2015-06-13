var express = require('express');
var router = express.Router();

// E: calling the models
Class = require('../models/class');
Student = require('../models/student');
//User = require('../models/user');

/* getting the classes the user is registered */
/* because the setting of the mongoDB id's at user AND student collections are different!!
   therefore the username is used instead...
*/
// we will be using the global defined user variable to extract the data !!!
router.get('/classes', ensureAuthenticated, function(req, res, next) {
    // here is where the new created method of object Student is initialised !!
    Student.getStudentByUsername(req.user.username, function(err,student){
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.render('students/classes', {'student':student});
      }
    });
  }
);


router.post('/classes/register', function(req,res){
    // filled with the info passed through the form
    info = [];
    info['student_username'] = req.user.username;
    //console.log(req.body.class_id);
    info['class_id'] = req.body.class_id;
    info['class_title'] = req.body.class_title;
    
    Student.register(info, function(err, student){
        if (err) throw err;
        console.log(student);
    });
    req.flash('success', 'You are registered');
    res.redirect('/students/classes');
})

function ensureAuthenticated(req,res,next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/')
}


module.exports = router;