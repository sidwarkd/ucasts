var DBManager = require('../lib/dbmanager');

// GET specific episode page
exports.show = function(req, res){
  var episodes = DBManager.DB.collection("episodes");
  episodes.findOne({permalink: req.params.permalink}, function(err, episode){
    if(episode != null){
      res.render('episode', episode);
    }
    else
      res.render('404', {title: 'Not Found' });
  });

};

exports.index = function(req, res){
  var episodes = DBManager.DB.collection("episodes");
  episodes.find({published:true}, {}, {sort: {episode_num:-1}}).toArray(function(err, allEpisodes){
    if(err === null){
      res.render('library', {title: 'Library', episodes: allEpisodes });
    }
    else
      res.render('library', {title: 'Library', episodes: [] });
  });
};