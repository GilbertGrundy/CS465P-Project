const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const rp = require("request-promise");
const connectionInfoDB = require("./connectionConfig.js");
const mysql = require("mysql");

let con = mysql.createConnection({
  host: connectionInfoDB.storageConfig.host,
  user: connectionInfoDB.storageConfig.user,
  password: connectionInfoDB.storageConfig.password,
  database: connectionInfoDB.storageConfig.database,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(express.urlencoded({ extended: true }));
app.post("/submit", (req, res) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);
  let queryString =
    "select ID, time, name, date, location, sex from members where " +
    keys[0] +
    '="' +
    values[0] +
    '" and ' +
    keys[1] +
    '="' +
    values[1] +
    '"';
  let params =
    keys[0] + "=" + values[0] + ";" + keys[1] + "=" + values[1] + ";";
  console.log(params);

  con.query(queryString, (error, results, fields) => {
    //con.end();
    res.header("Access-Control-Allow-Origin", "*");
    res.send(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
