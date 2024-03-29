#!/usr/bin/python

import sys
import os
import pymongo
from pymongo import MongoClient
import json
import markdown

numArgs = len(sys.argv)
args = {}
numDocsUpdated = 0

# if (numArgs < 3):
#   print "You missed something.  This is how you need to call the loader:"
#   print "python dbloader --db [connection string to db]"
#   exit(1)

processingArg = False
currentArg = ""

for i, arg in enumerate(sys.argv):
  if i == 0:
    continue

  if processingArg == True:
    args[currentArg] = arg
    processingArg = False

  if arg.startswith("--"):
    currentArg = arg.lstrip('-')
    args[currentArg] = ""
    processingArg = True

#print args
connection = None
db = None
episodes = None

if (args.get("episode") == None):
  print "You need to specify an episode JSON file to upload using the --episode argument"
  exit(1)

if (args.get("server") != None and args.get("db") != None and args.get("port") != None and args.get("user") != None and args.get("pw") != None):
  # use the default database
  connection = MongoClient(args.get("server"), int(args.get("port")))
  db = connection[args.get("db")]
  db.authenticate(args.get("user"), args.get("pw"))
else:
  # connect to the db they specified
  connection = MongoClient()
  db = connection.ucasts

episodes = db.episodes

json_data = open(args.get("episode"))
episode = json.load(json_data)

# Check to see if a markdown file exists and read it into the notes
if(os.path.isfile(args.get("episode").replace(".json", ".md"))):
  markdown_file = open(args.get("episode").replace(".json", ".md"))
  if(markdown_file != None):
    markdown_text = markdown_file.read();
    episode["notes"] = markdown.markdown(markdown_text, extensions=['extra']);

# Make sure the episode doesn't already exist
if(episode != None):
  db_Episode = episodes.find_one({"permalink": episode["permalink"]})
  if(db_Episode == None):
    print "Adding item to database"
    episodes.insert(episode)
    numDocsUpdated = numDocsUpdated + 1;
  else:
    response = raw_input("This item already exists in the database.  Overwrite? (y/n): ")
    if (response.lower() == "y"):
      print "updating"
      episodes.remove(db_Episode)
      episodes.insert(episode)
      numDocsUpdated = numDocsUpdated + 1;


print ""
print ""


print "DBLoader updated", numDocsUpdated, "documents in the database"