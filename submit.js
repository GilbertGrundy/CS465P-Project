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

app.post("/submitPerformances", (req, res) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);
  //TODO: sanitize keys/values
  let queryString = "(SELECT " +
                        "name, " +
                        "mark, " +
                        "day(date_of) AS day, " +
                        "monthname(date_of) AS month, " +
                        "year(date_of) AS year, " +
                        "venue, " +
                        "sex, " +
                        "relay, " +
                        "timetrial " +
                      "FROM " +
                        "jbac_records.results " +
                      "WHERE " +
                        "terrain = \"" + values[0] + "\" " + 
                        "AND	event = \"" + values[1] + "\" " + 
                        "AND sex = 0 " +
                      "ORDER BY " +
                        "mark ASC " +
                      "LIMIT 30) " +
                      "UNION " +
                      "(SELECT  " +
                        "name, " +
                        "mark, " +
                        "day(date_of) AS day, " +
                        "monthname(date_of) AS month, " +
                        "year(date_of) AS year, " +
                        "venue, " +
                        "sex, " +
                        "relay, " +
                        "timetrial " +
                      "FROM " +
                        "jbac_records.results " +
                      "WHERE " +
                        "terrain = \"" + values[0] + "\" " + 
                        "AND	event = \"" + values[1] + "\" " + 
                        "AND sex = 1 " +
                      "ORDER BY " +
                        "mark ASC " +
                      "LIMIT 30)";
  let params =
    keys[0] + "=" + values[0] + ";" + keys[1] + "=" + values[1] + ";";
  console.log(params);

  con.query(queryString, (error, results, fields) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(results);
  });
});

app.post("/submitRecords", (req, res) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);
  //TODO: sanitize keys/values
  let queryString ="(SELECT DISTINCT " +
                      "name, " +
                      "MIN(mark) AS mark, " +
                      "sex, " +
                      "timetrial, " +
                      "relay " +
                    "FROM " +
                      "jbac_records.results " +
                    "WHERE " +
                      "terrain = \"" + values[0] + "\" " +
                      "AND event = \"" + values[1] + "\" " +
                    "GROUP BY " +
                      "name, " +
                      "terrain, " +
                      "event " +
                    "ORDER BY " +
                      "mark ASC " +
                    "Limit 10 ) " +
                    "UNION " +
                    "(SELECT DISTINCT " +
                      "name, " +
                      "MIN(mark) AS mark, " +
                      "sex, " +
                      "timetrial, " +
                      "relay " +
                    "FROM " +
                      "jbac_records.results " +
                    "WHERE " +
                      "terrain = \"" + values[0] + "\" " +
                        "AND event = \"" + values[1] + "\" " + 
                        "AND sex = 1 " +
                    "GROUP BY " +
                      "name, " +
                      "terrain, " +
                      "event " +
                    "ORDER BY  " +
                      "mark ASC " +
                    "Limit 10) ";
  let params =
    keys[0] + "=" + values[0] + ";" + keys[1] + "=" + values[1] + ";";
  console.log(params);
  console.log(queryString);

  con.query(queryString, (error, results, fields) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(results);
  });
});

app.post("/events", (req, res) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);
  
  let queryString = "select distinct event from jbac_records.results where " 
    + keys[0] + '="' + values[0] + '"' 
    + " order by mark asc";
  console.log(queryString);

  con.query(queryString, (error, results, fields) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(results);
  });
});

//TODO: implement /update route
app.post("/update", (req, res) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);

//TODO:
//validate keys and values
//put together queryString

  con.query(queryString, (error, results, fields) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
