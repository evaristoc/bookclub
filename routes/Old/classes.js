var express = require('express');
var router = express.Router();

Class = require('../models/class');


/* GET home page. */
router.get('/', function(req, res, next) {
    Class.getClasses(function(err,classes){
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.render('classes/index', {'classes':classes});
      }
    },3); /*<---- E: adding limit HERE! */
  }
);

/* GET home page. */
router.get('/:id/details', function(req, res, next) {
    Class.getClassById([req.params.id], function(err,classname){
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.render('classes/details', {'class':classname});
      }
    }); /*<---- E: adding limit HERE! */
  }
);


module.exports = router;
