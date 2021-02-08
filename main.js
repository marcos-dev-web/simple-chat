const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server)

app.use(express.static('public'))

io.on('connection', (socket) => {
  console.log('[*] user connected');
  console.log(socket.id)
  socket.on('message', (value) => {
    socket.broadcast.emit('new_message', value)
  })
  socket.on('disconnect', () => {
    console.log('[*] user disconnected')
  })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log('listening on port: 3000')
})
