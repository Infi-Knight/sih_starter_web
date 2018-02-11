var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    flash           = require('connect-flash'),
    mongoose        = require('mongoose'),
    Project         = require('./models/project'),
    Comment         = require('./models/comment'),
    Rating          = require('./models/rating'),
    Ministry        = require('./models/ministry'),
    Suggestion      = require('./models/suggestion'),
    State           = require('./models/states'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    User            = require('./models/user'),
    request         = require('request');
    methodOverride  = require('method-override');


//requiring routes
var commentRoutes       = require('./routes/comments'),    
    projectRoutes       = require('./routes/projects'),
    indexRoutes         = require('./routes/index'),
    ministryRoutes      = require('./routes/ministries'),
    suggestionRoutes    = require('./routes/suggestions'),  
    stateRoutes         = require('./routes/states'),
    budgetRoutes        = require('./routes/budgets');           

mongoose.connect("mongodb://localhost/Modoner_v2"); 

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');
app.use(flash());

// seedDB();  //seed the database

//Passport configuration
app.use(require('express-session')({
    secret : "Sessionals suck",
    resave : false,
    saveUninitialized : false    
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passing currentuser data to every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/projects", projectRoutes);
app.use("/projects/:id/comments", commentRoutes);
app.use('/ministry', ministryRoutes);
app.use('/suggestions', suggestionRoutes);
app.use('/states', stateRoutes);
app.use('/budgets', budgetRoutes);





app.listen(3000, function(){
    console.log("Server Deployed");
});
