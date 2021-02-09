const router = require("express").Router();
const path = require("path");
const { verifyCookies, verify } = require("../middlewares.js");

router.get("/", verifyCookies, (req, res) => {
  res.render("index", { name: req.cookies["token-name"] });
});

router.get("/login", (req, res) => {
  if (!req.cookies["token-name"]) {
    res.sendFile(path.resolve("public", "login", "login.html"));
  } else {
    res.redirect("/");
  }
});

router.post("/login/verifylogin", (req, res) => {
  const { name } = req.body;
  console.log(name)
  if (!verify(name)) {
    res.send({
      msg: 'ok'
    });
  } else {
    res.send({
      msg: 'user already exist!'
    });
  }
});

router.post('/login/makelogin', (req, res) => {
  const { name } = req.body;
  global.users.push(name);
  res.cookie("token-name", name);
  res.redirect('/')
})

router.get("/logout", (req, res) => {
  let users = global.users;
  let name = req.cookies["token-name"];
  if (!name) {
    res.redirect("/login");
  }
  for (let key = 0; key < users.length; key++) {
    let user = users[key];
    if (user == name) {
      global.users.splice(key, key + 1);
    }
  }
  res.clearCookie("token-name");
  res.redirect('/login')
});

module.exports = router;
