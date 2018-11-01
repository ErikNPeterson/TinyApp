var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser') // is this right?

// var delay = require('express-delay');

app.set("view engine", "ejs");

app.use(cookieParser())




var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const generateRandomString = () => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (i = 0; i < 5; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      } 
      return text;
  }




const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/urls/new", (req, res) => {
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies["user_id"]]};
  res.render("urls_show", templateVars); 
});

app.post("/urls", (req, res) => {
  let newShortURL = generateRandomString();
  urlDatabase[newShortURL] = req.body.longURL;
  res.redirect(`/urls/${newShortURL}`);
});

//endpoint for REGISTRATION email & password
app.post("/registration", (req, res) => {
  if (!req.body.email || !req.body.password){
    res.status(400).send("Please enter a valid user_id and password before submitting. Please just press just press back on your browser and resubmit.")
  } else {
    let randomUserId = generateRandomString();
    users[randomUserId] = {id:randomUserId, email:req.body.email, password:req.body.password};
    res.cookie("user_id", randomUserId);
    res.redirect("/urls");
  }
});
//If someone tries to register with an existing user's email, 
//send back a response with the 400 status code.
//  require 
// also check if the user name exists 
// and if so return please enter your password.


// Oct 31st does this work ?
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// for modifying/updating the long URL
app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

//login and create cookie
app.post("/login", (req, res) => {
  res.cookie("user_id",req.body.user_id);
  res.redirect("/urls");
});

// logout and delete cookie
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});



app.get("/u/:shortURL", (req, res) => {
  // req.params takes the url input shortURL is the variable for the argument.
  res.redirect(urlDatabase[req.params.shortURL]); 
});

// Nov 1: updated user
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  res.render('urls_index', templateVars); 
});

// Nov 1: login endpoint
app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  res.render('urls_login.ejs', templateVars); 
});


// this will be the registration page
app.get("/registration", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  // Nov 1: let templateVars = { urls: urlDatabase, user_id: req.cookies["user_id"] };
  res.render('urls_registration', templateVars); 
});

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Instead of passing in the cookie value into the templates (via templateVars), 
// any endpoints rendering the _header.ejs partial should now pass in the entire user
//  object (not just their ID) by looking it up in the users object first.

// Change your templateVars (multiple endpoints) to pass in a user (object) property instead
//  of the previously implemented username (string) property.




// Upon receiving the POST request to "/urls" (and generating our shortURL), 
// we can add the new pair of shortURL and longURL strings to our URL database

// Add a new key-value pair to urlDatabase