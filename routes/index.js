module.exports = function(express, app){
  var indexrouter = express.Router();
  
  // Global Vars for index only
  app.use(function (req, res, next) {
  
    if(req.url == '/'){
      res.locals.isHome = true;
    }
    next();
  });
  
  /* GET home page. */
  indexrouter.get('/', function(req, res, next) {
    res.render('index', { title: 'Welcome to BookClub !' });
  });
  
  indexrouter.get('/about', function(req, res, next) {
    res.render('about', { title: 'About BookClub' });
  });
   
  app.use('/', indexrouter); 
}
