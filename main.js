
const express = require('express');
const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const path = require('path');
const mustacheExpress = require('mustache-express');
const port = 3000;
const app = express();
const dbUrl = "mongodb://localhost:27017/robotdb";

let DB;
let DBROBOTS;

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static("public"));

// CONNECT to MongoDB
mongoClient.connect(dbUrl, function(err, db) {
  if (err) {
    console.warn("Error connecting to database", err);
  }
  
  DB = db;
  DBROBOTS = db.collection("robots");
});

app.get("/", (req, res) => {
  DBROBOTS.find({}).toArray(function(err, foundRobots) {
    if (err) {
      console.warn("Error finding robots robotdb", err);
    }
    
   res.render("index", {robots: foundRobots});
  });
});

app.get("/employed", (req, res) => {
  DBROBOTS.find({ job : {$ne: null} }).toArray(function(err, foundEmployeed) {
    if (err) {
      console.warn("Error finding robots robotdb", err);
    }

   res.render("index", {robots: foundEmployeed});
  });
});

app.get("/unemployed", (req, res) => {
  DBROBOTS.find({ job : null }).toArray(function(err, foundEmployeed) {
    if (err) {
      console.warn("Error finding robots robotdb", err);
    }

   res.render("index", {robots: foundEmployeed});
  });
});

// COUNTRY
app.get("/country/:countryName", (req, res) => {
  DBROBOTS.find({ "address.country": req.params.countryName }).toArray(function(err, foundRobots) {
    if (err) {
      res.status(500).send(err);
    }

    res.render("index", {robots: foundRobots});
  });
});

// SKILL
app.get("/skill/:skillName", (req, res) => {
  DBROBOTS.find({ "skills": req.params.skillName }).toArray(function(err, foundRobots) {
    if (err) {
      res.status(500).send(err);
    }

    res.render("index", {robots: foundRobots});
  });
});

app.get("/:id", (req, res)=>{
  DBROBOTS.findOne({ _id: ObjectId(req.params.id) }, function(err, foundRobot) {
    if (err) {
      res.status(500).send(err);
    }
    
    res.render("detail", {robot: foundRobot});
  });
});

app.post("/:id", (req, res) => {

});

app.listen(port, function() {
  console.log('Express user directory Started on port', port);
});