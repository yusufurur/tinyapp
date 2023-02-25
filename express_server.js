const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const express = require("express");
const {generateRandomString, urlsForUser, authenticateUser, findUserByEmail} = require("./helpers");
const app = express();
app.use(cookieSession({
  name: 'session',
  keys: ["key1"],

  
  maxAge: 24 * 60 * 60 * 1000
}))
const PORT = 8080;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "lighthouse123"
  },
  "user2RandomID": {
    id: "userRandomID2",
    email: "user2@example.com",
    password: "lighthouselabs2023"
  }
}

// landing page
app.get("/", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls")
  }
  res.redirect("/login")
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlsForUser(urlDatabase, req.session.user_id),
    user: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  const templateVars = {
    user: users[req.session["user_id"]]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  if (!req.session.user_id) {
    return res.send("You need to login")
  }
  
  if (!urlDatabase[req.params.id]) {
    return res.send("shorturl doesn't exist")
  }

  if (urlDatabase[req.params.id].userID !== req.session.user_id) {
    return res.send("This url doesn't belong to you")
  }

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.session["user_id"]]
  };
  res.render("urls_show", templateVars);
});


app.get("/u/:id", (req, res) => {
  if(!urlDatabase[req.params.id]) {
    return res.send("shorturl does not exist")
  }
  const longURL = urlDatabase[req.params.id].longURL
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res.status(403).send("You are not logged in");
  }
  
  const urlId = generateRandomString();
  urlDatabase[urlId] = {
    longURL: req.body.longURL, 
    userID: req.session.user_id
  }
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  if (!req.session.user_id) {
    return res.send("You need to login")
  }
  
  if (!urlDatabase[req.params.id]) {
    return res.send("shorturl doesn't exist")
  }

  if (urlDatabase[req.params.id].userID !== req.session.user_id) {
    return res.send("This url doesn't belong to you")
  }
  urlDatabase[req.params.id].longURL = req.body.longURL
  res.redirect("/urls")
});

app.post("/urls/:id/delete", (req, res) => {
  if (!req.session.user_id) {
    return res.send("You need to login")
  }
  
  if (!urlDatabase[req.params.id]) {
    return res.send("shorturl doesn't exist")
  }

  if (urlDatabase[req.params.id].userID !== req.session.user_id) {
    return res.send("This url doesn't belong to you")
  }
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
});

app.get("/login", (req, res) => {
  if (req.session.user_id) {
    return res.redirect('/urls');
  }
  const templateVars = {
    user: null
  };
  res.render("urls_login", templateVars);
})

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = findUserByEmail(email, users);
  if (!user) {
    res.status(403).send("Invalid email or password");
  } if (!bcrypt.compareSync(password, user.password)) {
    res.status(403).send("Invalid password");
  } else {
    req.session.user_id = user.id;
    res.redirect("/urls");
  }
});

app.get("/register", (req, res) => {
 
  if (req.session.user_id) {
    return res.redirect('/urls');
  }
  const templateVars = {
    user: null
  };
  res.render("urls_register", templateVars);
})

app.post('/register', (req, res) => {
  for (let user of Object.values(users)) {
    if (req.body.email === user.email) {
      res.status(400)
      res.send("email exists")
      return;
    }
  }
  // error handling
  if (!req.body.email || !req.body.password) {
    console.log("#1");
    res.status(400);
    res.send("Please enter a valid email & password");
    return;
  }
  if (authenticateUser(users, req.body.email) !== false) {
    res.status(400);
    res.send("Email already exists, please log in");
    return;
  }
  // initialize user objs
  const userID = generateRandomString();
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  }

  req.session.user_id = userID;
  res.redirect('/urls');
})

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});