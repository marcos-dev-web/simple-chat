const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const http = require("http");
const socket = require("socket.io");
const cookieParser = require("cookie-parser");
const path = require("path");

const { notFound, notErros } = require("./middlewares");

const app = express();

const server = http.createServer(app);
const io = socket(server);

app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.referrerPolicy());

app.disable("x-powered-by");
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve("public"));
app.use(express.static(path.resolve("public")));
app.use(require("./routes/routes.js"));
app.use(notFound);
app.use(notErros);

global.users = [];

const users_id = {}

io.on("connection", (sock) => {
  console.log("[*] user connected: " + sock.id);

  sock.on("message", (msg, time, name) => {
    sock.broadcast.emit("new_message", msg, time, name);
  });

  sock.on("disconnect", () => {
    console.log(`[*] user [${users_id[sock.id]}] disconnected`);
    sock.broadcast.emit('user_disconnected', users_id[sock.id]);
    delete users_id[sock.id]
  });

  sock.on('my_name', (name) =>  {
    sock.broadcast.emit('new_user', name);
    users_id[sock.id] = name;
  })

});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("listening on port: 3000");
});
