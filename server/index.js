const express = require("express");
const app = express();
const { json } = require("body-parser");
const cors = require("cors");
const massive = require("massive");
require("dotenv").config();

massive(process.env.CONNECTION_STRING).then(dbInstance => {
  app.set("db", dbInstance); // {db: dbInstance}
});

app.use(cors());
app.use(json());

// controller.js
app.get("/api/cars", function(req, res) {
  const db = req.app.get("db");
  if (req.query.make) {
    return db
      .get_cars_by_make([req.query.make])
      .then(cars => res.status(200).json(cars))
      .catch(console.log);
  } else {
    return db
      .get_cars()
      .then(cars => res.status(200).json(cars))
      .catch(console.log);
  }
});
app.get("/api/car/:id", (req, res) => {
  const db = req.app.get("db");
  db
    .run("select * from cars where id = $1", req.params.id)
    .then(cars => res.status(200).json(...cars))
    .catch(console.log);
});
app.post("/api/car", (req, res) => {
  const db = req.app.get("db");
  const { make, model, year } = req.body;
  db
    .create_new_car([make, model, year])
    .then(cars => {
      res.status(200).json(cars);
    })
    .catch(console.log);
});

app.listen(3000, () => console.log(`I'm Dr Crane... I'm Listening`));
