module.exports = function(express, app) {
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Welcome to BookClub !' });
  });
 
   router.get('/About', function(req, res, next) {
    res.render('About', { title: 'About BookClub' });
  });
  
  app.use('/', router);

}