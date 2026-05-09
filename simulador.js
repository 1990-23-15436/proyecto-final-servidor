const URL = `http://server-grupo9-umg.duckdns.org:5000/api/logs`;

// Componentes físicos del tanque
const componentes = [
  'Ruedas',
  'Cañón',
  'Torreta',
  'Sistema de Freno'
];

// Acciones descriptivas por componente
const acciones = [
  'Movimiento Adelante',
  'Movimiento Atrás',
  'Giro a la Derecha',
  'Giro a la Izquierda',
  'Disparo',
  'Rotación Torreta Derecha',
  'Rotación Torreta Izquierda',
  'Freno de Emergencia'
];

// Dispositivos de origen que pueden enviar logs
const dispositivos = [
  'Samsung Galaxy S21 - App Bluetooth',
  'iPhone 13 - App Bluetooth',
  'Laptop Dell - Terminal USB',
  'Servidor Remoto - Dashboard Web'
];

async function enviarLog() {
  // Simula cuánto tiempo se mantuvo presionado el botón (entre 200ms y 3000ms)
  const tiempoEjecucion = Math.floor(Math.random() * 2800) + 200;

  const data = {
    component:      componentes[Math.floor(Math.random() * componentes.length)],
    action:         acciones[Math.floor(Math.random() * acciones.length)],
    execution_time: tiempoEjecucion,
    source_device:  dispositivos[Math.floor(Math.random() * dispositivos.length)],
    status:         Math.random() > 0.1 ? 'success' : 'error' // 10% de probabilidad de error
  };

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log(`✅ Log enviado | ${data.component} → ${data.action} | ${data.execution_time}ms | ${data.source_device} | ${data.status}`);
  } catch (error) {
    console.error('❌ Error enviando log (¿Está el backend encendido?):', error.message);
  }
}

console.log('🚀 Iniciando simulador de tanque...');
console.log(`📡 Enviando logs a: ${URL}\n`);
setInterval(enviarLog, 3000);