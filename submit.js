const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const rp = require("request-promise");

app.use(express.urlencoded({ extended: true }));
app.post("/submit", (req, res) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body)
  let params = keys[0] + "=" + values[0] + ";" + keys[1] + "=" + values[1] + ";"; 
  console.log(params);
  
  rp("https://restcountries.eu/rest/v2/all?fields=name;capital;population;region;")
    .then((body) => {
      res.send(body);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
