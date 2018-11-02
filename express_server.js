var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser') // is this right?

app.set("view engine", "ejs");

app.use(cookieParser())




var urlDatabase = {
  // "b2xVn2": {
  //   user_id: "g5c2f5",
  //   url: "http://www.lighthouselabs.ca"
  // }
    

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
  },
  "user3RandomID": {
    id: "user3RandomID", 
    email: "test", 
    password: "test"
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
  // what do I need for templateVars here ???
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies["user_id"]]};
  let user_id = req.cookies["user_id"];
  if (user_id){ 
    res.render("urls_new", templateVars);
  } else {
    res.send('<form action="/urls"><input type="submit" value="Please login to use this feature." /></form>');
  }

});

app.get("/urls/:id", (req, res) => {
  console.log('DATABASE', urlDatabase);
  console.log('req.params.id', req.params.id);
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].url,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars); 
});

// Nov 1: creating a new shortURL
app.post("/urls", (req, res) => {
  let user_id = req.cookies["user_id"];
  let newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {url: req.body.longURL, user_id: user_id } ;
  console.log(urlDatabase);
  res.redirect(`/urls/${newShortURL}`);
});

//endpoint for REGISTRATION email & password
app.post("/registration", (req, res) => {
  if (!req.body.email || !req.body.password){
    res.status(400).send("Please enter a valid user_id and password before submitting. Please just press just press back on your browser and resubmit.");
  } else {
    for (let newUserId in users){
      if (users[newUserId].email === req.body.email){
          return res.status(403).send("This email is already registered. Please try use another email to register with.");
        }
      }
      let user_id = generateRandomString();
      users[user_id] = {id:user_id, email:req.body.email, password:req.body.password};
      res.cookie("user_id", user_id);
      res.redirect("/urls");        
  }

});


// We suggest creating a function named urlsForUser(id) which returns the subset of the URL
//  database that belongs to the user with ID id, so that your endpoint code remains clean.

// Similarly, this also means that the /urls/:id page should display a message or
//  prompt if the user is not logged in, or if the the URL with the matching :id 
// does not belong to them.

// Oct 31st // for deleting the URL
app.post("/urls/:id/delete", (req, res) => {
  let user_id = req.cookies["user_id"]
  // if cookie user = urldatabse user 
 if (user_id === urlDatabase[req.params.id].user_id){  // what should Id be
   urlDatabase[req.params.id].url = req.body.longURL;
   delete urlDatabase[req.params.id];
   res.redirect("/urls");
 } else {
   res.send('<form action="/urls"><input type="submit" value="Sorry but you are unable to DELETE or EDIT this URL. Click here to go back." /></form>');
 }
  
});

//Nov 1: for modifying/updating the long URL
app.post("/urls/:id/update", (req, res) => {
  let user_id = req.cookies["user_id"]
   // if cookie user = urldatabse user 
  if (user_id === urlDatabase[req.params.id].user_id){  // what should Id be
    urlDatabase[req.params.id].url = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.send('<form action="/urls"><input type="submit" value="Sorry but you are unable to EDIT or DELETE this URL. Click here to go back." /></form>');
  }
});


// Nov 1: login and create cookie
app.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password){ // is there an input ?
    res.status(400).send("Please enter a valid user_id and password before submitting. Please just press just press back on your browser and resubmit.");
  } 
  //create a loop to match 
  for (var userId in users){
    if (users[userId].email === req.body.email){
      if (users[userId].password === req.body.password){
        res.cookie("user_id", userId);
        res.redirect("/urls");
      } else {
        res.status(403).send("user password is incorrect");
      }
    }
  }
  res.status(403).send(`User '${req.body.email}' connot be found. Please check your email.`);
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



function urlsForUser(user_id) { 
  let newObject = {};
  for(let property in urlDatabase){ 
    if (urlDatabase[property].user_id === user_id){
      newObject[property] = urlDatabase[property];
  }
}
return newObject;

}
// Nov 2, Nov 1: updated user
app.get("/urls", (req, res) => {
  // use OUR FUNCTION HERE replace url database with the function.
  let templateVars = { 
    urls: urlsForUser(req.cookies.user_id), 
    user: users[req.cookies["user_id"]]
   };
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
})