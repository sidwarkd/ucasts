var express = require('express')
  , routes = require('./routes')
  , episodes = require('./routes/episodes')
  //, user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , DBManager = require('./lib/dbmanager');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view options', {layout: false});
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('*', function(req,res,next){
  if(req.headers['x-forwarded-proto']!='https')
    if(process.env.NODE_ENV == 'production')
      res.redirect('https://www.hardlysoftware.com' + req.url)
    else
      next();
  else
    next();
});
app.get('/', routes.index);
app.get('/faq', routes.faq);
app.get('/contact', routes.contact);
app.get('/rss', routes.rss);
app.get('/episodes/:permalink', episodes.show);
app.get('/reviews', routes.reviews);
//app.get('/users', user.index);

// Set up the database first, then start the app
DBManager.on("dbInitialized", function(){
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
});

// A successful connection to the database will initiate the web server
// Otherwise the DBManager will issue an error.
DBManager.connect();

