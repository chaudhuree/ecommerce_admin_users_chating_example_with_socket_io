const express = require('express')
const app = express() // make an express app
// serve the files in public statically
app.use(express.static('public'))
const expressServer = app.listen(4000)

const { Server } = require('socket.io') 
const socketio = require('socket.io')

const io = new Server(expressServer,{    
    cors: [
        'http://localhost:4000'
    ]
})


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // Handle user joining their chat room
    socket.on('joinChat', (userId) => {
      const roomName = `user_${userId}`;
      socket.join(roomName);
      console.log(`User ${userId} joined room: ${roomName}`);
    });
  
    // Handle messages from users
    // userId is the user's unique identifier (e.g. user_1/user_2)
    socket.on('userMessage', ({ userId, message }) => {
        // user j room a join kore ache seitay send kortice
      const roomName = `user_${userId}`;
      // Send message to both the user's room and the admin
      io.to(roomName).emit('newMessage', { sender: `user_${userId}`, message, userId });
      io.to('adminRoom').emit('newMessage', { sender: `user_${userId}`, message, userId }); // Emit to admin
    });
  
    // Handle messages from admin
    socket.on('adminMessage', ({ userId, message }) => {
      const roomName = `user_${userId}`;
      io.to(roomName).emit('newMessage', { sender: 'admin', message, userId });
    });
  
    socket.on('adminJoin', () => {
      socket.join('adminRoom'); // Admin joins the adminRoom
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
  
  