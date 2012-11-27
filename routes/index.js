
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.yo = function(req, res){
  res.render('container-app', {title: 'WTF?', body: 'Here I am.'});
};