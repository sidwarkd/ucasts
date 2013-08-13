var DBManager = require('../../lib/dbmanager');

exports.free = function(req, res){
  var episodes = DBManager.DB.collection("episodes");
  episodes.find({published:true}, {}, {sort: {episode_num:-1}}).toArray(function(err, allEpisodes){
    if(err === null){
      res.json(200, allEpisodes);
    }
    else
      res.json(500, {err: "Unabled to get episode list"});
  });
};