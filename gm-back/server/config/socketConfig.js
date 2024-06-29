const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173','http://localhost:3000']
    },
  })
  
  io.on('connection', (socket) => {
    //console.log("Connection:"+socket.id);
  });

module.exports = io;