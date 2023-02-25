function generateRandomString() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function authenticateUser(email, users) {
  for (let userID in users) {
    const user = users[userID];
    if (user.email === email) {
      // res.redirect('/urls');
      return true;
    }
  }
  return false;
}

function findUserByEmail(email, users) {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user.id;
    }
  }
  return null; // user not found
}

function urlsForUser (urlDatabase, userID) {
  const result = {}
  for (const shorturl in urlDatabase) {
    if (urlDatabase[shorturl].userID === userID) {
      result[shorturl] = urlDatabase[shorturl].longURL
    }
  }
  console.log("result", result);
  return result
}

module.exports = {generateRandomString, urlsForUser, authenticateUser, findUserByEmail};