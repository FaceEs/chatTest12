var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/firstDb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myquery = { name: 'Antonyasha' };
  db.collection("students").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
  });
});