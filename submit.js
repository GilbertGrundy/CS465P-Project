const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const rp = require("request-promise");
const connectionInfoDB = require("./connectionConfig.js");
const mysql = require("mysql");
const { query } = require("express");
let myHost = process.env.HOST;
let myUser = process.env.USER;
let myPassword = process.env.PASSWORD;
let myDB = process.env.DATABASE;

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
  let queryString =
    "(SELECT " +
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
    'terrain = "' +
    values[0] +
    '" ' +
    'AND	event = "' +
    values[1] +
    '" ' +
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
    'terrain = "' +
    values[0] +
    '" ' +
    'AND	event = "' +
    values[1] +
    '" ' +
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

app.post("/submitAthletePerformances", (req, res) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);
  //TODO: sanitize keys/values
  let queryString =
    "SELECT " +
    "event, " +
    "mark, " +
    "venue, " +
    "day(date_of) AS day, " +
    "monthname(date_of) AS month, " +
    "year(date_of) AS year, " +
    "terrain, " +
    "relay, " +
    "timetrial " +
    "FROM " +
    "jbac_records.results " +
    "WHERE " +
    'name = "' +
    values[0] +
    '" ' +
    "ORDER BY " +
    "date_of DESC ";
  console.log(queryString);
  let params = keys[0] + "=" + values[0] + ";";
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
  let queryString =
    "(SELECT DISTINCT " +
    "name, " +
    "MIN(mark) AS mark, " +
    "sex, " +
    "timetrial, " +
    "relay " +
    "FROM " +
    "jbac_records.results " +
    "WHERE " +
    'terrain = "' +
    values[0] +
    '" ' +
    'AND event = "' +
    values[1] +
    '" ' +
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
    'terrain = "' +
    values[0] +
    '" ' +
    'AND event = "' +
    values[1] +
    '" ' +
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

app.post("/submitRaceTotals", (req, res) => {
  let queryString =
    "SELECT " +
    "name, " +
    "terrain, " +
    "COUNT(terrain) AS num " +
    "FROM " +
    "jbac_records.results " +
    "GROUP BY " +
    "name, " +
    "terrain " +
    "ORDER BY " +
    "name " +
    "ASC ";
  console.log(queryString);

  con.query(queryString, (error, results, fields) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(results);
  });
});

app.post("/events", (req, res) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);

  let queryString =
    "select distinct event from jbac_records.results where " +
    keys[0] +
    '="' +
    values[0] +
    '"' +
    " order by mark asc";
  console.log(queryString);

  con.query(queryString, (error, results, fields) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(results);
  });
});

app.post("/venues", (req, res) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);
  let queryString =
    "select distinct venue from jbac_records.results where " +
    keys[0] +
    '="' +
    values[0] +
    '"' +
    " AND " +
    keys[1] +
    '="' +
    values[1] +
    '"' +
    " order by mark asc";
  console.log(queryString);

  con.query(queryString, (error, results, fields) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(results);
  });
});

app.post("/athletes", (req, res) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);
  let queryString = "select distinct name from jbac_records.members";
  console.log(queryString);

  con.query(queryString, (error, results, fields) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(results);
  });
});

app.post("/submitEventPerformances", (req, res) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);
  //TODO: sanitize keys/values
  let queryString =
    "(SELECT " +
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
    'terrain = "' +
    values[0] +
    '" ' +
    'AND	event = "' +
    values[1] +
    '" ' +
    'AND	venue = "' +
    values[2] +
    '" ' +
    "AND sex = 0 " +
    "ORDER BY " +
    "mark ASC) " +
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
    'terrain = "' +
    values[0] +
    '" ' +
    'AND	event = "' +
    values[1] +
    '" ' +
    'AND	venue = "' +
    values[2] +
    '" ' +
    "AND sex = 1 " +
    "ORDER BY " +
    "mark ASC) ";
  console.log(queryString);
  let params =
    keys[0] +
    "=" +
    values[0] +
    ";" +
    keys[1] +
    "=" +
    values[1] +
    ";" +
    keys[2] +
    "=" +
    values[2] +
    ";";
  console.log(params);

  con.query(queryString, (error, results, fields) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(results);
  });
});

//TODO: implement /update route
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
    if (error) {
      results.message = "failure";
    } else {
      results.message = "success";
    }
    res.send(results);
  });
});

app.post("/delete", (req, res) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);

  let queryString =
    "delete from jbac_records.testTable where name = " +
    "'" +
    values[0] +
    "'" +
    " and date_of = " +
    "'" +
    values[1] +
    "'" +
    " and venue = " +
    "'" +
    values[2] +
    "'" +
    " and event = " +
    "'" +
    values[3] +
    "'";

  con.query(queryString, (error, results, fields) => {
    res.header("Access-Control-Allow-Origin", "*");
    if (error) {
      results.message = "delete failure";
    } else {
      results.message = "delete success";
    }
    res.send(results);
  });
});

//TODO: implement modify route
app.post("/modify", (req, res) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);
  let sex = values[6];
  let relay = values[7];
  let timeTrial;
  let columnQuery = "(";
  let valueQuery = "";
  let whereQuery = " where ";
  //TODO: validate keys and values

  //format column string for database
  for (let i = 0; i < values.length; i++) {
    if (values[i].length > 0) {
      columnQuery += keys[i];
      if (
        values[i][0] !== "0" &&
        values[i][0] !== undefined &&
        values[i][0].length > 1
      ) {
        whereQuery += values[i][0];
      }
      if (i < values.length - 1) {
        columnQuery += ",";
      }
    }
  }
  columnQuery += ")";

  //format value string for database
  for (let i = 0; i < 6; i++) {
    if (values[i].length > 0) {
      let temp = values[i][1];
      if (
        values[i][1] !== "0" &&
        values[i][1] !== undefined &&
        values[i][1].length > 1
      ) {
        valueQuery += keys[i] + " = " + "'" + values[i][1] + "',";
      }
      if (i > 3) {
        valueQuery += keys[i] + " = " + "'" + values[i] + "'";
      }
      if (i < 6 && i > 3) {
        valueQuery += ",";
      }
    }
  }

  if (values[10] === "M") {
    valueQuery += keys[6] + " = 0,";
  } else {
    valueQuery += keys[6] + " = 1, ";
  }

  if (values[11] === "Yes") {
    valueQuery += keys[7] + " = 1, ";
  } else {
    valueQuery += keys[7] + " = 0, ";
  }

  if (values[12] === "Yes") {
    valueQuery += keys[8] + " = 1, ";
  } else {
    valueQuery += keys[8] + " = 0 ";
  }

  let queryString =
    "update jbac_records.testTable set " +
    valueQuery +
    " where " +
    keys[0] +
    " = " +
    "'" +
    values[0][0] +
    "' and " +
    keys[1] +
    " = " +
    "'" +
    values[1][0] +
    "' and " +
    keys[2] +
    " = '" +
    values[2][0] +
    "' and " +
    keys[3] +
    " = '" +
    values[3][0] +
    "'";

  con.query(queryString, (error, results, fields) => {
    res.header("Access-Control-Allow-Origin", "*");
    if (error) {
      results.message = "modify failure";
    } else {
      results.message = "modify success";
    }
    res.send(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
