var express = require('express');
var router = express.Router();
var Ministry = require('../models/ministry');
var Project = require('../models/project');
var Budget = require('../models/budget');
var middleware = require('../middleware');

//index page
router.get('/', function(req, res){
	Ministry.find({}, function(err, ministries){
		if(err){
			console.log(err);
		}else{
			res.render('ministries/index', {ministries : ministries});
		}
	})
});


//post new program
router.post('/:id', middleware.isGovLoggedIn, function(req, res){
	var newProgram = {
		programs:{
			title : req.body.title,
			image : req.body.image,
			status : req.body.status,
			description : req.body.description
		}
	}

	Ministry.findById(req.params.id, function(err, foundMinistry){
		foundMinistry.create(newProgram, function(err, newProgram){
			if(err){
				console.log(err);
			}else{
				res.redirect('ministry/' + req.params.id);
			}
		});
	})
});


//new program form
router.get('/:id/new_program', middleware.isGovLoggedIn, function(req, res){
	res.render('newProgram');
});

//show route
router.get('/:id', function(req, res){
	Ministry.findById(req.params.id).populate('projects').exec(function(err, foundMinistry){
		if(err){
			console.log(err)
		}else{
			Project.find({}, function(err, projects){
		        if(err){
		            console.log("Something went wrong!");
		        }else{
		        	Budget.find({}, function(err, budgets){
		        		if(err){
		        			console.log(err)
		        		}else{
		        			res.render('ministries/show', {ministry: foundMinistry, projects : projects, budgets:budgets});	
		        		}
		        	})
		        	 	   
		        }
    		});
		}
	})
})



module.exports = router; 



