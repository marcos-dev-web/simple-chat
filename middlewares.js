const verify = (name) => {
  const users = global.users;
  let userExist = false;

  for (user of users) {
    if (name === user) {
      userExist = true;
      break;
    }
  }
  return userExist;
};

const verifyCookies = (req, res, next) => {
  const name = req.cookies["token-name"];
  if (name) {
    next();
  } else {
    res.redirect("/login");
  }
};

module.exports = {
  verifyCookies,
  verify,
};
