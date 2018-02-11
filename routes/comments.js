var express = require('express');
var router = express.Router({mergeParams : true});
var Project = require('../models/project');
var Comment = require('../models/comment');
var Rating = require('../models/rating');
var request = require('request');
var middleware = require('../middleware'); 

// //new comment
// router.get('/new', middleware.isLoggedIn, function(req, res){
//     Project.findById(req.params.id, function(err, project){
//         if(err){
//             console.log(err);
//         }else{
//             res.render('comments/new', {project : project});              
//         }
//     });
  
// });

//create comment
router.post('/', middleware.isUserLoggedIn, function(req, res){
    Project.findById(req.params.id, function(err, project){
        if(err){
            console.log(err);
            res.redirect('/projects')
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!")
                    console.log(err);
                }
                                //associating comment with user 
                                comment.author.id = req.user._id;
                                comment.author.username = req.user.username;
                                comment.save();

                                //adding comment to main db
                                project.comments.push(comment);
                                project.save();
                                req.flash("success", "Posted Successfully!")
                                res.redirect('/projects/' + project._id);
    
            });    
        }
    });
});

router.post('/reply', middleware.isGovLoggedIn, function(req,res){
    Project.findById(req.params.id, function(err, project){
        if(err){
            console.log(err);
            res.redirect('/projects')
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!")
                    console.log(err);
                }else{
                    //associating comment with user 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    //adding comment to main db
                    project.comments.push(comment);
                    project.save();
                    req.flash("success", "Posted Successfully!")
                    res.redirect('/projects/' + project._id);
                }
            });    
        }
    });    
})

//post rating
router.post('/rating', middleware.isUserLoggedIn, function(req, res){
    Project.findById(req.params.id, function(err, project){
        if(err){
            console.log(err);
            res.redirect('/projects')
        }else{
            Rating.create(req.body.star, function(err, rating){
                if(err){
                    req.flash("error", "Something went wrong!")
                    console.log(err);
                }else{
                    rating.author.id = req.user._id;
                    rating.author.username = req.user.username;
                    rating.save();

                    project.ratings.push(rating);
                    project.save();
                    req.flash("success", "Successfully Rated!");
                    res.redirect('/projects/' + project._id);
                }
            })
        }
    })
})

//Edit comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.render("back");
        }else{
            res.render('comments/edit', {project_id:req.params.id, comment:foundComment})
        }
    })

});

//Update comment
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.render("back");
        }else{
            res.redirect('/projects/'+req.params.id);
        }
    })
});

//Destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.render('back');
        }else{
            req.flash("success", "Comment Deleted!!")
            res.redirect('/projects/' + req.params.id)
        }
    })
})

//middelware



module.exports = router;