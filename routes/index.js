var DBManager = require('../lib/dbmanager');
/*
 * GET home page.
 */
function GetRFC822Date(oDate){
  
  // allow for empty request
  if(typeof(oDate) == "undefined" || !oDate) oDate = new Date();
 
  //Pads numbers with a preceding 0 if the number is less than 10.
  var LZ = function(val){ return (parseInt(val) < 10) ? "0" + val : val; }
  
  /* accepts the client's time zone offset from GMT in minutes as a parameter. returns the timezone offset in the format [+|-}DDDD */
  var getTZOString = function(timezoneOffset){
    var hours = Math.floor(timezoneOffset/60);
    var modMin = Math.abs(timezoneOffset%60);
    var s = new String();
    s += (hours > 0) ? "-" : "+";
    var absHours = Math.abs(hours)
    s += (absHours < 10) ? "0" + absHours :absHours;
    s += ((modMin == 0) ? "00" : modMin);
    return(s);
  }
 
  var aMonths = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
  var aDays = new Array( "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
  var dtm = new String();
    
  dtm = aDays[oDate.getDay()] + ", ";
  dtm += LZ(oDate.getDate()) + " ";
  dtm += aMonths[oDate.getMonth()] + " ";
  dtm += oDate.getFullYear() + " ";
  dtm += LZ(oDate.getHours()) + ":";
  dtm += LZ(oDate.getMinutes()) + ":";
  dtm += LZ(oDate.getSeconds()) + " " ;
  dtm += getTZOString(oDate.getTimezoneOffset());
  return dtm;
}

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

exports.rss = function(req, res){
  var episodes = DBManager.DB.collection("episodes");
  episodes.find({published:true}, {}, {sort: {episode_num:-1}, limit:20 }).toArray(function(err, allEpisodes){
    if(err === null){
      res.render('rss', {
        title: 'RSS', 
        episodes: allEpisodes,
        dateFormat: GetRFC822Date,
        channel: {
          title: "uCasts",
          link: "http://hardlysoftware.com",
          description: "Short, focused chunks of embedded learning awesomeness."
        },
        layout: false
      });
    }
    else
      res.render('rss', {
        title: 'RSS', 
        episodes: [],
        dateFormat: GetRFC822Date,
        channel: {
          title: "uCasts",
          link: "http://hardlysoftware.com",
          description: "Short, focused chunks of embedded learning awesomeness."
        },
        layout: false
      });
  });
};

