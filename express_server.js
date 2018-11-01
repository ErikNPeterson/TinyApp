var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser') // is this right?


app.set("view engine", "ejs");
app.use(cookieParser()) // is this right?


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
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"]};
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
    res.status(400).send('Youre a terrible person because you didnt enter both a email and password!');
    //res.redirect("/registration"); ??? how do I get this to work!!!
  } else {
  let randomUserId = generateRandomString();
  users[randomUserId] = {id:randomUserId, email:req.body.email, password:req.body.password};
  res.cookie("username", randomUserId);
  res.redirect("/urls");
  }
});
// POST /register endpoint, and implement it such that it adds a new user 
// object in the global users object which keeps track of the newly registered 
// user's email, password and user ID.

// To generate a random user ID, use the same function you used to generate random
//  IDs for URLs.

// ???? Set the cookie and redirect. ??????

// After it appends the object to the users object, it should:

// Set a user_id cookie containing the user's (newly generated) ID.
// Redirect the user back to the /urls page.
// Test that the users object is properly being appended to.

// You can insert a console.log or debugger prior to the redirect logic to inspect what data the object contains.

// Also test that the user_id cookie is being set correctly upon redirection.

// You already did this sort of testing in the Cookies in Express activity. Use the same approach here.




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
  res.cookie("username",req.body.username);
  res.redirect("/urls");
});

// logout and delete cookie
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});



app.get("/u/:shortURL", (req, res) => {
  // req.params takes the url input shortURL is the variable for the argument.
  res.redirect(urlDatabase[req.params.shortURL]); 
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  // are we rendering the urlDatabase this in the template vars object above ?
  res.render('urls_index', templateVars); 
});

// this will be the registration page
app.get("/registration", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
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

// Upon receiving the POST request to "/urls" (and generating our shortURL), 
// we can add the new pair of shortURL and longURL strings to our URL database

// Add a new key-value pair to urlDatabase