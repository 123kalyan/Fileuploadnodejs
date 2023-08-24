const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");
var imageModel = require("../Nodejs/models/imageSchema");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => {
  console.log("connected to Database");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("view options", {
  layout: false,
});

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

// app.get("/", (req, res) => {
//   res.render("index");
// });

app.get("/", (req, res) => {
  res.render("first");
});

app.post("/student/add", (req, res) => {
  console.log(req.body);
  res.send("data is populated in to database");
});

app.post("/uploadphoto", upload.single("myImage"), (req, res) => {
  console.log(req);
  var file = req.file;
  var img = fs.readFileSync(req.file.path);
  var encode_img = img.toString("base64");
  var final_img = {
    contentType: req.file.mimetype,
    image: new Buffer(encode_img, "base64"),
  };

  res.send({
    message: "Uploaded",
    id: file.id,
    name: file.filename,
    contentType: file.contentType,
  });

  const userData = {
    name: "krishnav",
    img: final_img,
  };

  const user = new imageModel(userData);

  user.save();
});
//Code to start server
app.listen(5000, function () {
  console.log("Server Started at PORT 5000");
});
