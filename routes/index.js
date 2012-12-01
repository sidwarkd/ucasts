
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {title: 'Home' });
};

exports.about = function(req, res){
  res.render('about', {title: 'About' });
};

exports.connect = function(req, res){
  res.render('connect', {title: 'Connect' });
};