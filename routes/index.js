var DBManager = require('../lib/dbmanager');
/*
 * GET home page.
 */

exports.index = function(req, res){
  var episodes = DBManager.DB.collection("episodes");
  episodes.find({published:true}, {}, {sort: {episode_num:-1}}).toArray(function(err, allEpisodes){
    if(err === null){
      res.render('index', {title: 'Home', episodes: allEpisodes });
    }
    else
      res.render('index', {title: 'Home', episodes: [] });
  });

};

exports.about = function(req, res){
  res.render('about', {title: 'About' });
};

exports.connect = function(req, res){
  res.render('connect', {title: 'Connect' });
};