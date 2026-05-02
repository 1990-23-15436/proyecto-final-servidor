
const URL = `http://server-grupo9-umg.duckdns.org:5000/api/logs`;

const componentes = ['chassis', 'turret'];
const acciones = ['FORWARD', 'BACKWARD', 'ROTATE_LEFT', 'ROTATE_RIGHT', 'FIRE'];

async function enviarLog() {
    const data = {
        component: componentes[Math.floor(Math.random() * componentes.length)],
        action: acciones[Math.floor(Math.random() * acciones.length)],
        value: Math.floor(Math.random() * 270), // Simula grados o potencia
        status: Math.random() > 0.1 ? 'success' : 'error' // 10% de probabilidad de error
    };

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('Log enviado con éxito:', result);
    } catch (error) {
        console.error('Error enviando log (¿Está el backend encendido?):', error.message);
    }
}

// Enviar un log cada 3 segundos
console.log('Iniciando simulador de tanque...');
setInterval(enviarLog, 3000);