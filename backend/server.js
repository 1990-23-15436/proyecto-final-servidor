const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/TankDB';

mongoose.connect(mongoUri)
  .then(() => console.log("✅ Conectado a MongoDB satisfactoriamente"))
  .catch(err => console.error("❌ Error conectando a MongoDB:", err));

const LogSchema = new mongoose.Schema({
  // Fecha y hora en que se ejecutó la instrucción (se genera automáticamente)
  timestamp: { type: Date, default: Date.now },

  // Nombre del componente que ejecutó la acción (ej: "Cañón", "Ruedas", "Torreta")
  component: { type: String, required: true },

  // Nombre descriptivo de la acción ejecutada (ej: "Movimiento Derecha", "Disparo")
  action: { type: String, required: true },

  // Duración en milisegundos que se mantuvo presionado el botón en la aplicación
  execution_time: { type: Number, required: true },

  // Nombre del dispositivo de origen que generó el log (ej: "App Bluetooth", "Terminal USB")
  source_device: { type: String, required: true },

  // Estado del resultado de la acción
  status: { type: String, enum: ['success', 'error'], required: true }
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
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = 5000;
app.listen(PORT, '::', () => console.log(`Backend corriendo en puerto ${PORT}`));