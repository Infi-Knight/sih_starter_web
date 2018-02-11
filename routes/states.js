var express = require('express');
var router = express.Router();
var State = require('../models/states');
var Project = require('../models/project')
var middleware = require('../middleware');

router.get('/:id', function(req, res){
	State.findById(req.params.id, function(err, foundState){
		if(err){
			console.log(err);
		}else{
			res.render('states/show', {state : foundState});
		}
	})
})




module.exports = router;