var DBManager = require('../lib/dbmanager');
var stripe = require('stripe')('sk_test_IzGsaLtPZYYaDfJdBwXDojMD');

exports.index = function(req, res){
  res.render('soda/index', {title:"Mo Bettah Vending"});
};

exports.charge = function(req, res){
  var token = req.param("stripeToken");
  var email = req.param("email");
  var desc = req.param("description");
  var amt = req.param("amount");

  if(token !== undefined){
    stripe.charges.create({
      amount:amt,
      currency:"usd",
      card:token,
      description:desc
    }, function(err, charge){
      if(err){
        console.log("Unable to charge card.");
        console.log(err);
        console.log(charge);
        res.render('soda/order_failure', {title: "Charge Failed", message: err.message});
      }
      else{
        console.log("Successfully charged card.");
        console.log(charge);
        res.render('soda/order_complete', {title: "Thank You!"});
      }
    });
  }
};