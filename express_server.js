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

//login 
app.post("/login", (req, res) => {
  res.cookie("username",req.body.username);
  res.redirect("/urls");
});

// logout
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});



// <h4>You are logged in as: <%= username %></h4></form>
//   <form method="POST" action="/logout">
//       <!-- here we need to erase our cookie as our action -->
//      <input type="submit" value="logout">
//    </form> 
  
//   <!-- add a log out button with functionality -->







app.get("/u/:shortURL", (req, res) => {
  // req.params takes the url input shortURL is the variable for the argument.
  res.redirect(urlDatabase[req.params.shortURL]); 
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  // are we rendering the urlDatabase this in the template vars object above ?
  res.render('urls_index', templateVars); 
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