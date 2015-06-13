module.exports = function(express, app){
    var router = express.Router();
    
    Book = require('../models/Book');
    
    
    /* USE THIS TO GET INTO ???? */
    router.get('/user', function(req, res, next) {
        Class.getClasses(function(err,classes){
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            res.render('user/books/index', {'books':book});
          }
        },3); /*<---- E: adding limit HERE! */
      }
    );
    
    /* USE THIS ONE TO CHECK DATA ABOUT A PARTICULAR BOOK */
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
}
