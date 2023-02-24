const cookieParser = require("cookie-parser");
const express = require("express");
// const {
//   authenticateUser,
//   getUserByEmail,
//   createUser,
//   sayBob,
//   updatePassword
// } = require("./users");

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
    username: req.cookies["username"]
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
  res.redirect(`/urls/${req.params.id}`);
});

app.post('/login', (req, res) => {
  const cookie = req.body.username
  res.cookie("user_id", cookie);
  res.redirect('/urls');
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
  res.redirect('/urls');
  res.redirect("/urls");
})

app.get("/register", (req, res) => {
  console.log("hello");
  const templateVars = {
    user: null
  };
  res.render("urls_register", templateVars);
})

app.post("/register", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const user_id = generateRandomString();
  const user = {
    id: user_id,
    email: req.body.email,
    password: req.body.password
  }
  users[user_id] = user;
  console.log(users);

  if (req.body.email === "" | req.body.password === "") {
    res.status(400).send("400 Bad Request ")
  } else {
    res.cookie("user_id", userId);
    res.redirect('/urls');
  }
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: null
  };
  res.render("urls_login", templateVars);
})













































// // app.get("/register", (req, res) => {
// //   const templateVars = { 
// //   username: req.cookies["username"]
// //   };
// //   res.cookie("user_id", newUserID);
// //   res.render("/urls",templateVars);
// // });

// app.post("/register", (req, res) => {
//   const { email, password } = req.body;
//   const id = generateRandomString();

//   const newUser = {
//     id,
//     email,
//     password: bcrypt.hashSync(password, 10)
//   };

//   users[id] = newUser;

//   res.cookie("user_id", id);
//   res.redirect("/urls");
// });

// // app.post("/register", (req, res) => {
// //   const newUserID = generateRandomString();
// //   const email = req.body.email
// //   const password = req.body.password;
// //   const user = {
// //     id : newUserID,
// //     email : email,
// //     password : password
// //   }; 
// //   users[newUserID] = user;
// //   console.log(users);

// //   if (user.email === "" | user.password === ""){
// //     res.send("400 Bad Request ")
// //   }
// //   res.cookie("user_id", newUserID);
// //   res.redirect("/urls");         
// // });
