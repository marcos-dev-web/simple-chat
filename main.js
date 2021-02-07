const express = require('express');
const http = require('http');
const socket = require('socket.io');

const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socket(server)

app.use(express.static('public'))


io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('message', (value) => {
    socket.broadcast.emit('new_message', value)
  })
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(3000, () => {
  console.log('listening on port: 3000')
})
