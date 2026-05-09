const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/TankDB';

mongoose.connect(mongoUri)
  .then(() => console.log("✅ Conectado a MongoDB satisfactoriamente"))
  .catch(err => console.error("❌ Error conectando a MongoDB:", err));

const LogSchema = new mongoose.Schema({
  timestamp:      { type: Date, default: Date.now },
  component:      String,  // chassis | turret
  action:         String,  // FORWARD, BACKWARD, ROTATE_LEFT, ROTATE_RIGHT, FIRE
  execution_time: Number,  // tiempo de ejecución en milisegundos
  source_device:  String,  // bluetooth | usb | server
  status:         String   // success | error
});

const Log = mongoose.model('Log', LogSchema);

// Recibir logs del robot
app.post('/api/logs', async (req, res) => {
  try {
    const newLog = new Log(req.body);
    await newLog.save();
    res.status(201).send(newLog);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Leer logs para el Dashboard
app.get('/api/logs', async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(50);
  res.json(logs);
});

const PORT = 5000;
app.listen(PORT, '::', () => console.log(`Backend corriendo en puerto ${PORT}`));