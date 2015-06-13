module.exports = function(express, app) {
  var router = express.Router();

  // Global Vars for index only
  app.use(function (req, res, next) {
  
    if(req.url == '/'){
      res.locals.isHome = true;
    }
    next();
  });

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Welcome to BookClub !' });
  });
 
   router.get('/about', function(req, res, next) {
    res.render('about', { title: 'About BookClub' });
  });

  
  app.use('/', router);

}