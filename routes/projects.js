var express = require('express');
var router = express.Router();
var Project = require('../models/project');
var middleware = require('../middleware');

//index route
router.get('/', function(req, res){

    Project.find({}, function(err, projects){
        if(err){
            console.log("Something went wrong!");
        }else{
            res.render("projects/index", {projects : projects});
        }
    });
});

//create new post route
router.post('/', middleware.isGovLoggedIn, function(req, res){
    var fDate = req.body.start_date;
    var sDate = fDate.split("-");
    var beginDate = new Date(sDate[0], sDate[1] - 1, sDate[2]);



    var toDate = req.body.end_date;
    var eDate = toDate.split("-");
    var targetDate = new Date(eDate[0], eDate[1] - 1, eDate[2]);

    var totalTime = (targetDate - beginDate);
    var dateProgress = new Date() - beginDate;
    var completionPercentage = (Math.round((dateProgress / totalTime) * 100));

    var newProject = {
             title : req.body.title,
             ministryName : req.body.ministry,
             image : req.body.image_url,
             head : req.body.head,
             budget : req.body.budget,
             startDate : req.body.start_date,
             endDate : req.body.end_date,
             percentage : completionPercentage,
             description : req.body.description,
             author : {
                 id: req.user._id,
                 username: req.user.departmentName    
             }
    }   

    Project.create(newProject, function(err, newProject){
        if(err){
            console.log(err)
        }else{
            res.redirect('/projects');
        }
    });
});

//page to write new post
router.get('/new', middleware.isGovLoggedIn, function(req, res){
   res.render('projects/new');
});

//show route
router.get('/:id', function(req, res){
    Project.findById(req.params.id).populate('comments').populate('ratings').exec(function(err, foundProject){
        if(err){
            console.log(err);
        }else{
            res.render('projects/show', {project : foundProject});
        }
    });
});

//EDIT route
router.get('/:id/edit', middleware.checkProjectOwnership, function(req, res){
    Project.findById(req.params.id, function(err, foundProject){
        if(err){
            req.flash("error", "Project not found");
        }
        res.render('projects/edit', {project:foundProject});
    })
;});

//UPDATE Route
router.put("/:id", middleware.checkProjectOwnership, function(req, res){
    Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, updatedPost){
        if(err){
            res.redirect('/projects');
        }else{
            res.redirect('/projects/' + req.params.id);
        }
    })
});

//Destroy Route
router.delete('/:id', middleware.checkProjectOwnership, function(req, res){
    Project.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/projects');
        }else{
            res.redirect('/projects');  
        }
    });  
});  

//middelware




module.exports = router; 