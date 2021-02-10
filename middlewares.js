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

const notFound = (req, res) => {
  res.status(404).render("errors/404", { url: req.url });
};

const notErros = (err, req, res) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error to execute this action, try again later'
  })
}

module.exports = {
  verifyCookies,
  verify,
  notFound,
  notErros
};
