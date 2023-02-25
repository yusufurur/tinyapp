const cookieParser = require("cookie-parser");
const express = require("express");

const app = express();
app.use(cookieParser());
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

function generateRandomString() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function authenticateUser(users, email, password) {
  for (let userID in users) {
    const user = users[userID];
    if (user.email === email && user.password === password) {
      res.redirect('/urls');
      return user;
    }
  }
  return false;
}

function findUserByEmail(email, users) {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null; // user not found
}

function urlsForUser (urlDatabase, userID) {
  const result = {}
  for (let shorturl in urlDatabase) {
    if (urlDatabase[shorturl].userID === userID) {
      result[shorturl] = urlDatabase[shorturl].longURL
    }
  }
  return result
}

// landing page
app.get("/", (req, res) => {
  if (req.cookies.user_id) {
    return res.redirect("/urls")
  }
  res.redirect("/login")
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlsForUser(urlDatabase, req.cookies.user_id),
    user: users[req.cookies.user_id]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies.user_id) {
    return res.redirect('/login');
  }
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  if (!req.cookies.user_id) {
    return res.send("You need to login")
  }
  
  if (!urlDatabase[req.params.id]) {
    return res.send("shorturl doesn't exist")
  }

  if (urlDatabase[req.params.id].userID !== req.cookies.user_id) {
    return res.send("This url doesn't belong to you")
  }

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.cookies["user_id"]]
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
  if (!req.cookies.user_id) {
    return res.status(403).send("You are not logged in");
  }
  
  const urlId = generateRandomString();
  urlDatabase[urlId] = {
    longURL: req.body.longURL, 
    userID: req.cookies.user_id
  }
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  if (!req.cookies.user_id) {
    return res.send("You need to login")
  }
  
  if (!urlDatabase[req.params.id]) {
    return res.send("shorturl doesn't exist")
  }

  if (urlDatabase[req.params.id].userID !== req.cookies.user_id) {
    return res.send("This url doesn't belong to you")
  }
  urlDatabase[req.params.id].longURL = req.body.longURL
  res.redirect("/urls")
});

app.post("/urls/:id/delete", (req, res) => {
  if (!req.cookies.user_id) {
    return res.send("You need to login")
  }
  
  if (!urlDatabase[req.params.id]) {
    return res.send("shorturl doesn't exist")
  }

  if (urlDatabase[req.params.id].userID !== req.cookies.user_id) {
    return res.send("This url doesn't belong to you")
  }
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
});

app.get("/login", (req, res) => {
  if (req.cookies.user_id) {
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
  } else if (user.password !== password) {
    res.status(403).send("Invalid email or password");
  } else {
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  }
});

// come back to this you can still register with the same email

app.get("/register", (req, res) => {
  if (req.cookies.user_id) {
    return res.redirect('/urls');
  }
  console.log("hello");
  const templateVars = {
    user: null
  };
  res.render("urls_register", templateVars);
})

app.post('/register', (req, res) => {
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
    password: req.body.password
  }

  console.log(users);
  //cookie time
  res.cookie('user_id', userID);
  res.redirect('/urls');
})

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.render("/urls");
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});