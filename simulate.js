const io = require('socket.io-client');
const socket = io('http://localhost:5000');

const vehicleId = 'vehicle1';
let lat = 12.9716;
let lng = 77.5946;

setInterval(() => {
  lat += 0.0001;
  lng += 0.0001;
  socket.emit('locationUpdate', { id: vehicleId, lat, lng });
}, 1000);
