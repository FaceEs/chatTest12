var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/firstDb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myobj = { name: "Антоняша", group: "П-403", nickname: "Хмырь болотный" };
  db.collection("students").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});