const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socket = require("socket.io");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

const server = http.createServer(app);
const io = socket(server);

app.disable("x-powered-by");
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve("public", "chat"));
app.use(express.static(path.resolve("public")));
app.use(require("./routes/routes.js"));

global.users = [];

io.on("connection", (sock) => {
  console.log("[*] user connected: " + sock.id);

  sock.on("message", (msg, time, name) => {
    sock.broadcast.emit("new_message", msg, time, name);
  });

  sock.on("disconnect", () => {
    console.log("[*] user disconnected");
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("listening on port: 3000");
});
