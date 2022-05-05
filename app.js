//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const port = 3000;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res) => {
  res.render("home")
})

app.get("/login", (req,res) => {
  res.render("login")
})

app.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;


  User.findOne({email: username}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  })
});

app.get("/register", (req,res) => {
  res.render("register")
})

app.post("/register", (req,res) => {

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/secretsUserDB');
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});


userSchema.plugin(encrypt,
  { secret: process.env.SECRET,
    encryptedFields: ['password'],
    additionalAuthenticatedFields: ['email'],
    requireAuthenticationCode: false,
  });

const User = mongoose.model('User', userSchema);

app.listen(port, () => {
  console.log(`Successfully connected on port ${port}`)
})
