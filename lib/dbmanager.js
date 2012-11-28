var mongo = require("mongodb");
var util = require("util");
var events = require("events");

var DbManager = function(){

  events.EventEmitter.call(this);

  this.connect = function(){
    var self = this;
    mongo.connect(process.env.MONGOLAB_URI || "mongodb://localhost:27017/ucasts", {safe:true}, function(error, db){
      if(error){
        self.emit("connectionFailed", error);
      }
      else{
        self.emit("dbConnected", db);
      }
    });
  };

  var _connectFailure = function(err){
    console.log("Failed to connect to mongo db:");
    console.log(err);
  };

  var _initializeDb = function(db){
    db.addListener("error", function(error){
      console.log(error);
    });

    this.DB = db;
    console.log("Database Initialized");
    this.emit("dbInitialized", db);
  }

  this.on("connectionFailed", _connectFailure);
  this.on("dbConnected", _initializeDb);

};

util.inherits(DbManager, events.EventEmitter);

module.exports = DbManager;