const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB (usando la variable de entorno de Docker)
// Usará la variable MONGO_URI definida en el docker-compose
const mongoUri = process.env.MONGO_URI || `mongodb://mongodb:27017/TankDB`;

mongoose.connect(mongoUri)
  .then(() => console.log("✅ Conectado a MongoDB satisfactoriamente"))
  .catch(err => console.error("❌ Error conectando a MongoDB:", err));

// Definición del esquema para los logs del tanque [cite: 22]
const LogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  component: String, // chassis o turret
  action: String,    // FORWARD, ROTATE, etc.
  value: Number,     // grados o velocidad
  status: String     // success o error
});

const Log = mongoose.model('Log', LogSchema);

// Endpoint para RECIBIR logs del robot 
app.post('/api/logs', async (req, res) => {
  try {
    const newLog = new Log(req.body);
    await newLog.save();
    res.status(201).send(newLog);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Endpoint para que el Dashboard (React) LEA los logs [cite: 34]
app.get('/api/logs', async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(50);
  res.json(logs);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));