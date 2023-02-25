const cookieParser = require("cookie-parser");
const express = require("express");

const app = express();
app.use(cookieParser());
const PORT = 8080;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const urlId = generateRandomString();
  urlDatabase[urlId] = req.body.longURL
  res.redirect("/urls");
});

app.post('/u/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect("/urls");
})

app.get("/urls/:id/edit", (req, res) => {
  res.render(`/urls_show${req.params.id}`);
});



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

function authenticateUser(users, email, password) {
  for (let userID in users) {
    const user = users[userID];
    if (user.email === email && user.password === password) {
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

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

app.get("/urls", (req, res) => {
  console.log("users", users[req.cookies.user_id]);
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id]
  };
  res.render("urls_index", templateVars);
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.render("/urls");
})

app.get("/register", (req, res) => {
  console.log("hello");
  const templateVars = {
    user: null
  };
  res.render("urls_register", templateVars);
})


app.get("/login", (req, res) => {
  const templateVars = {
    user: null
  };
  res.render("urls_login", templateVars);
})

