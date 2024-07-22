import io from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('receiveMessage', (message) => {
  console.log('Message received:', message);
});

const sendMessage = (message) => {
  socket.emit('sendMessage', message);
};
