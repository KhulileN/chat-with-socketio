const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Colors for other users
const colors = ['#28a745', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14'];

io.on('connection', (socket) => {
  console.log('A user connected');

  // Assign random color to other users (not sender)
  const userColor = colors[Math.floor(Math.random() * colors.length)];
  const username = `User-${socket.id.slice(0, 4)}`;

  socket.emit('system message', `Welcome ${username}!`);
  socket.broadcast.emit('system message', `${username} has joined the chat`);

  socket.on('chat message', (data) => {
    // Broadcast to others with their assigned color
    socket.broadcast.emit('chat message', { 
      msg: data.msg, 
      username: data.username, 
      color: userColor 
    });
  });

  socket.on('disconnect', () => {
    console.log(`${username} disconnected`);
    socket.broadcast.emit('system message', `${username} has left the chat`);
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
