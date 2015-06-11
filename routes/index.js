module.exports = function(express, app) {
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Welcome to BookClub !' });
  });
  
  app.use('/', router);

}