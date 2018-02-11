var express = require('express');
var request = require('request');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Project = require('../models/project');
var middleware = require('../middleware');

//root route
router.get('/', function(req, res){
    Project.find({}, function(err, projects){
        if(err){
            console.log("Something went wrong!");
        }else{
            res.render("landing", {projects : projects});
        }
    });
});

router.get('/landing/ministry', function(req, res){
    res.render('ministryLanding');
});

router.get('/about', function(req, res){
    res.render('about')
})

router.get('/contact', function(req, res){
    res.render('contact')
})

router.get('/report', middleware.isGovLoggedIn, function(req, res){
        request('http://127.0.0.1:8000/', function(err, res, body){
            console.log(err);
            console.log(res && res.statusCode);
            console.log(body);
        });
        res.redirect('/projects/' + req.body._id)
})

//============
//AUTH Routes
//============

//Show user signup form
router.get('/register/user', function(req, res){
    res.render('register');
});

//user register logic
router.post('/register/user', function(req,res){
    var newUser = new User({
        firstName : req.body.fName,
        lastName : req.body.lName,
        username : req.body.username,
        email : req.body.email,
        aadharId : req.body.aadhar,
        role : "User"
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);
            res.redirect('/register/user');
        }else{
                passport.authenticate('local')(req, res, function(){
                 req.flash("success", "Welcome to The North East Portal " + user.fName);
                 res.redirect('/');       
            });
        }
    });   
});

//show gov signup form
router.get('/register/gov', function(req, res){
    res.render('register_gov');
});

//gov register logic
router.post('/register/gov', function(req, res){
    var newGovUser = new User({
        username : req.body.username,
        departmentName : req.body.departmentName,
        key : req.body.ministryKey,
        role : "GovUser"
    });
    User.register(newGovUser, req.body.password, function(err, govUser){
        if(err){
            req.flash('error', err.message);
            res.redirect('register/gov');
        }else{
            passport.authenticate('local')(req, res, function(){
                req.flash("success", "Welcome " + govUser.departmentName);
                res.redirect('/landing/ministry');
            });
        }
    });
});

//user login route
router.get('/login/user', function(req, res){
    res.render('login_user');
});

router.post('/login/user', passport.authenticate('local', 
    {
        successRedirect : '/',
        failureRedirect : '/login/user'
    }), function(req, res){

});

//gov login route
router.get('/login/gov', function(req, res){
    res.render('login_gov');
});

router.post('/login/gov', passport.authenticate('local', 
    {
        successRedirect : '/landing/ministry',
        failureRedirect : 'login/gov'
    }), function(req, res){

});

//logout route
router.get('/logout', function(req, res){
    req.logout();
    req.flash("success", "Successfully Logged You Out!");
    res.redirect('/');
}); 


module.exports = router;