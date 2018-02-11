//all the middleware goes here

var Project = require('../models/project');
var Comment = require('../models/comment');
var request = require('request');

var middlewareObj = {};

middlewareObj.checkProjectOwnership = function(req, res, next){
	if(req.isAuthenticated()){
	    Project.findById(req.params.id, function(err, foundProject){
	        if(err){
                req.flash("error", "Project not found");
	            res.redirect("back");
	        }else{
	            if(foundProject.author.id.equals(req.user._id)){
	                next();
	            }else{
                    req.flash("error", "You don't have permission to do that");
	                res.redirect("back");
	            }
	        }
	    });
	}else{
        req.flash("error", "You need to be logged in to do that!")
	    res.redirect("back");
	}  
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect('back');
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that!")
                    res.redirect("back");
                }
            }
        })
    } else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }    
}

middlewareObj.isUserLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
            if(req.user.role === "User"){
             return next();   
         }else{
            req.flash("error", "Only Public users can do that!");
            res.redirect('back');
         }
    }else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect('back');
    }
}

middlewareObj.isGovLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
         if(req.user.role === 'GovUser'){
            return next();
        }else{
            req.flash("error", "You Don't Have Permission To Do That!");
            res.redirect('back');
        }   
    }else{
        req.flash("error", "You Don't Have Permission To Do That!");
        res.redirect('back');
    }
}

middlewareObj.isMoDonerLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
         if(req.user.role === 'GovUser'){
            if(req.user.username === 'modoner'){
                return next();   
            }
            
        }else{
            req.flash("error", "You Don't Have Permission To Do That!");
            res.redirect('back');
        }   
    }else{
        req.flash("error", "You Don't Have Permission To Do That!");
        res.redirect('back');
    }
}

middlewareObj.checkComment = function(req, res, next){
    var status;
    var commentText = req.body.comment.text;

    request('http://127.0.0.1:8000/Checking/' + commentText, function(err, res, body){
        console.log(err);
        console.log(res && res.statusCode);
        console.log(body);
        var Result = "Result";
        status = body.Result;
        console.log(status);
        if(status === 'true'){
            next();
        }else{
            req.flash("error", "Vulgar comments not allowed!")
        }
    });

    if(status === 'false'){
        res.redirect('back');
    }
}


module.exports = middlewareObj;