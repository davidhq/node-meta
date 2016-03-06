"use strict"

let args = process.argv.slice(2)

let file = args[0]

if(file) {

  // Type 3: Persistent datastore with automatic loading
  var Datastore = require('nedb')
    , db = new Datastore({ filename: file, autoload: true });

  // Find all documents in the collection
  db.find({}, function (err, docs) {
    console.log(docs)
  });

} else {
  console.log("Usage: exam file.db")
}
