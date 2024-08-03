// const express = require('express');
// const mongoose = require('mongoose');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.use(cors());
// app.use(express.json());

// mongoose.connect('mongodb://localhost/vehicle-tracking', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const vehicleSchema = new mongoose.Schema({
//   id: String,
//   lat: Number,
//   lng: Number,
// });

// const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('locationUpdate', async (data) => {
//     const { id, lat, lng } = data;
//     await Vehicle.findOneAndUpdate({ id }, { lat, lng }, { upsert: true, new: true });
//     io.emit('locationUpdate', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// app.get('/vehicles', async (req, res) => {
//   const vehicles = await Vehicle.find();
//   res.send(vehicles);
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/vehicle-tracking';

mongoose.connect(mongoUri).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const vehicleSchema = new mongoose.Schema({
  id: String,
  lat: Number,
  lng: Number,
});
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('locationUpdate', async (data) => {
    const { id, lat, lng } = data;
    try {
      await Vehicle.findOneAndUpdate({ id }, { lat, lng }, { upsert: true, new: true });
      io.emit('locationUpdate', data);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.send(vehicles);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching vehicles' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
