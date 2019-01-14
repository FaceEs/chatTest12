mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "Olga",
  password: "olimpiada",
  database: "recipes"
}); 


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "UPDATE myCollection SET id = '12' WHERE id='41'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});
