import React, { useEffect, useState } from 'react';

function App() {
  const [logs, setLogs] = useState([]);

  // Función para obtener datos del Backend
  const fetchLogs = () => {
    fetch(`http://${process.env.SERVER_IP}:5000/api/logs`) // URL del Backend
      .then(response => response.json())
      .then(data => setLogs(data))
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000); // Refrescar cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Dashboard del Tanque - Logs de Eventos</h1>
      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Componente</th>
            <th>Acción</th>
            <th>Valor</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.component}</td>
              <td>{log.action}</td>
              <td>{log.value}</td>
              <td style={{ color: log.status === 'success' ? 'green' : 'red' }}>
                {log.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;