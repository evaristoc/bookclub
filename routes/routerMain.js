module.exports = function(express,app) {
    
    var routerMain = express.Router();
    
    routerMain.get("/", function(req, res, next) {
       res.render("main", {whichRoute:"Main Route"}); 
    });
    
    routerMain.get("/about", function(req, res, next) {
        res.render("main", {whichRoute:"About Route"});
    });
    
    app.use("/", routerMain);
    
}