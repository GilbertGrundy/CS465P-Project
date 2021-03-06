const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const rp = require("request-promise");
const connectionInfoDB = require("./connectionConfig.js");
const mysql = require("mysql");
const { query } = require("express");

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
  //TODO: validate keys and values
  let queryString =
    "select mark, mark, name, date_of, venue, sex from results where " +
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
    res.header("Access-Control-Allow-Origin", "*");
    res.send(results);
  });
});

app.post("/update", (req, res) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);
  let sex = values[6];
  let relay = values[7];
  let timeTrial;
  //TODO: validate keys and values

  //format user input for database
  if (values[6] === "M") {
    sex = 0;
  } else {
    sex = 1;
  }

  if (values[7] === "Yes") {
    relay = 1;
  } else {
    relay = 0;
  }

  if (values[8] === "Yes") {
    timeTrial = 1;
  } else {
    timeTrial = 0;
  }

  let queryString =
    "insert into jbac_records.testTable (mark, name, date_of, venue, event, terrain, sex, relay, timetrial) values('" +
    values[0] +
    "', '" +
    values[1] +
    "', '" +
    values[2] +
    "', '" +
    values[3] +
    "', '" +
    values[4] +
    "', '" +
    values[5] +
    "', " +
    sex +
    ", " +
    relay +
    ", " +
    timeTrial +
    ")";

  con.query(queryString, (error, results, fields) => {
    res.header("Access-Control-Allow-Origin", "*");
    if(error){
      results.message = 'failure';
    }
    else{
      results.message = 'success';
    }
    res.send(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
