var express = require('express');
var router = express.Router();
var Budget = require('../models/budget');
var middleware = require('../middleware');

router.post('/', middleware.isGovLoggedIn, function(req, res){

	var amDiff = (((parseInt(req.body.total)/100)*10) - req.body.amountSpent).toString(10);

	var newBudget = {
		ministry: req.body.ministry,
		total: req.body.total,
		year: req.body.year,
		amountSpent: req.body.amountSpent,
		amountDifference: amDiff
	}

	Budget.create(newBudget, function(err, newBudget){
		if(err){
			console.log(err);
		}else{
			res.redirect('/landing/ministry');
		}
	})
}) 

router.get('/new',middleware.isGovLoggedIn, function(req, res){
	res.render('budgets/new');
});

router.get('/show', middleware.isMoDonerLoggedIn, function(req, res){
	res.render('budgets/show');
});

router.post('/detailed', middleware.isMoDonerLoggedIn, function(req, res){
	var yr = req.body.year.toString();
	var min = req.body.ministry.toString();

	// if(yr === "All"){
	// 	var budgetObject;
	// 	Budget.find({"ministry" : min}, function(err, foundBudget){
	// 		for(var i =0; i<foundBudget.length; i++)
	// 		{
	// 			budgetObject[i] =
	// 				{
	// 					ministry : foundBudget[i].ministry,
	// 					total : foundBudget[i].total,
	// 					year : foundBudget[i].year,
	// 					amountSpent : foundBudget[i].amountSpent,
	// 					amountDifference : foundBudget[i].amountDifference
	// 				}
	// 		}
	// 		console.log(budgetObject)
	// 		res.render('budgets/details', {budget : budgetObject, query : yr});
	// 	})
	// }

	Budget.find({"year" : yr, "ministry" : min}, function(err, foundBudget){
		console.log(foundBudget);

		var budgetObject = {
			ministry : foundBudget[0].ministry,
			total : foundBudget[0].total,
			year : foundBudget[0].year,
			amountSpent : foundBudget[0].amountSpent,
			amountDifference : foundBudget[0].amountDifference
		}

		console.log(budgetObject);

		res.render('budgets/details', {budget : budgetObject, query : yr});
	})
});


module.exports = router;