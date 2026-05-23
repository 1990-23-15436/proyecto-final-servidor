import React, { useEffect, useState } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-primary: #080c0f;
    --bg-secondary: #0d1317;
    --bg-card: #0f1a1f;
    --bg-card-hover: #132028;
    --border: #1a3040;
    --border-bright: #1e4060;
    --amber: #d4920a;
    --amber-bright: #f5a623;
    --amber-dim: #7a5200;
    --amber-glow: rgba(212, 146, 10, 0.15);
    --green: #2aff8f;
    --green-dim: rgba(42, 255, 143, 0.15);
    --red: #ff3d5a;
    --red-dim: rgba(255, 61, 90, 0.15);
    --blue: #7b9fff;
    --blue-dim: rgba(123,159,255,0.05);
    --text-primary: #d0dde5;
    --text-secondary: #6a8a9a;
    --text-muted: #3a5060;
    --scan-line: rgba(255,255,255,0.02);
  }

  html, body, #root {
    height: 100%;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'Rajdhani', sans-serif;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      var(--scan-line) 2px, var(--scan-line) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  .dashboard {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background:
      radial-gradient(ellipse 80% 40% at 50% -10%, rgba(212,146,10,0.07) 0%, transparent 70%),
      var(--bg-primary);
  }

  /* HEADER */
  .header {
    border-bottom: 1px solid var(--border);
    padding: 0 2.5rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(13,19,23,0.95);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-left { display: flex; align-items: center; gap: 1.2rem; }

  .header-emblem {
    width: 36px; height: 36px;
    border: 2px solid var(--amber);
    transform: rotate(45deg);
    display: flex; align-items: center; justify-content: center;
    animation: pulse-border 3s ease-in-out infinite;
  }

  .header-emblem-inner {
    width: 14px; height: 14px;
    background: var(--amber);
    box-shadow: 0 0 8px var(--amber);
  }

  @keyframes pulse-border {
    0%, 100% { box-shadow: 0 0 12px var(--amber-glow), inset 0 0 8px var(--amber-glow); }
    50% { box-shadow: 0 0 24px rgba(212,146,10,0.35), inset 0 0 12px rgba(212,146,10,0.2); }
  }

  .header-title h1 {
    font-family: 'Orbitron', sans-serif;
    font-size: 1rem; font-weight: 700;
    letter-spacing: 0.15em;
    color: var(--amber-bright);
    text-shadow: 0 0 20px rgba(245,166,35,0.4);
  }

  .header-title span {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: var(--text-secondary);
    letter-spacing: 0.2em;
    margin-top: 2px;
    display: block;
  }

  .header-right { display: flex; align-items: center; gap: 2rem; }

  .status-indicator {
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem; color: var(--text-secondary); letter-spacing: 0.1em;
  }

  .status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
  }

  .live-clock {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem; color: var(--amber); letter-spacing: 0.15em;
    border: 1px solid var(--border-bright);
    padding: 0.25rem 0.75rem;
    background: var(--amber-glow);
  }

  /* STATS BAR */
  .stats-bar {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    border-bottom: 1px solid var(--border);
  }

  .stat-cell {
    padding: 1.25rem 1.5rem;
    border-right: 1px solid var(--border);
    position: relative; overflow: hidden;
    transition: background 0.3s;
  }

  .stat-cell:last-child { border-right: none; }

  .stat-cell::before {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 2px;
    background: var(--amber);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s ease;
  }

  .stat-cell:hover::before { transform: scaleX(1); }
  .stat-cell:hover { background: var(--bg-card-hover); }

  .stat-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem; color: var(--text-muted);
    letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.4rem;
  }

  .stat-value {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.6rem; font-weight: 700;
    color: var(--amber-bright); line-height: 1;
    text-shadow: 0 0 20px rgba(245,166,35,0.3);
  }

  .stat-sub {
    font-size: 0.68rem; color: var(--text-secondary);
    margin-top: 0.3rem;
    font-family: 'Share Tech Mono', monospace;
  }

  /* MAIN */
  .main-content {
    flex: 1; padding: 1.5rem 2.5rem 2.5rem;
    display: flex; flex-direction: column; gap: 1.5rem;
  }

  .section-header {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 1rem;
  }

  .section-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem; color: var(--text-secondary);
    letter-spacing: 0.25em; text-transform: uppercase;
    display: flex; align-items: center; gap: 0.75rem;
  }

  .section-title::before {
    content: ''; display: inline-block;
    width: 20px; height: 1px; background: var(--amber);
  }

  .record-count {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem; color: var(--text-muted);
    letter-spacing: 0.15em;
    border: 1px solid var(--border); padding: 0.2rem 0.6rem;
  }

  /* TABLE */
  .table-container {
    border: 1px solid var(--border);
    background: var(--bg-card);
    overflow: hidden; position: relative;
  }

  .table-container::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--amber), transparent);
    opacity: 0.6;
  }

  table { width: 100%; border-collapse: collapse; }

  thead tr {
    background: rgba(212,146,10,0.05);
    border-bottom: 1px solid var(--border-bright);
  }

  th {
    padding: 0.85rem 1rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem; font-weight: 400;
    color: var(--amber-dim); letter-spacing: 0.2em;
    text-transform: uppercase; text-align: left;
    white-space: nowrap;
  }

  th:first-child { padding-left: 1.5rem; }
  th:last-child { text-align: center; }

  tbody tr {
    border-bottom: 1px solid rgba(26,48,64,0.5);
    transition: background 0.2s;
    animation: row-enter 0.4s ease forwards;
    opacity: 0;
  }

  @keyframes row-enter {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }

  tbody tr:hover { background: var(--bg-card-hover); }
  tbody tr:last-child { border-bottom: none; }

  td {
    padding: 0.8rem 1rem;
    font-size: 0.88rem; color: var(--text-primary);
    vertical-align: middle;
  }

  td:first-child { padding-left: 1.5rem; }
  td:last-child { text-align: center; }

  /* Timestamp */
  .td-timestamp {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem; color: var(--text-secondary);
    white-space: nowrap;
  }
  .td-date {
    display: block; color: var(--text-muted);
    font-size: 0.68rem; margin-top: 2px;
  }

  /* Component */
  .component-tag {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-size: 0.85rem; font-weight: 600;
    color: var(--amber);
  }
  .component-tag::before {
    content: '';
    display: inline-block;
    width: 6px; height: 6px;
    background: var(--amber);
    border-radius: 50%;
    box-shadow: 0 0 6px var(--amber);
  }

  /* Action */
  .action-tag {
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.9rem; font-weight: 500;
    color: var(--text-primary);
    display: flex; align-items: center; gap: 0.5rem;
  }
  .action-tag::before { content: '›'; color: var(--amber); font-size: 1.1rem; }

  /* Execution time */
  .exec-bar-wrap {
    display: flex; align-items: center; gap: 0.6rem;
  }
  .exec-bar-bg {
    width: 60px; height: 4px;
    background: var(--border);
    border-radius: 2px; overflow: hidden;
  }
  .exec-bar-fill {
    height: 100%;
    background: var(--amber);
    border-radius: 2px;
    transition: width 0.3s;
  }
  .exec-value {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem; color: var(--amber);
    white-space: nowrap;
  }

  /* Source device */
  .source-cell {
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.85rem; font-weight: 500;
    color: var(--blue);
    display: flex; align-items: center; gap: 0.5rem;
  }
  .source-cell::before {
    content: '📡';
    font-size: 0.75rem;
  }

  /* Status */
  .status-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase;
    padding: 0.3rem 0.8rem; border: 1px solid; margin: 0 auto;
  }
  .status-badge.success {
    color: var(--green); border-color: rgba(42,255,143,0.3); background: var(--green-dim);
  }
  .status-badge.error {
    color: var(--red); border-color: rgba(255,61,90,0.3); background: var(--red-dim);
  }
  .status-dot-sm {
    width: 5px; height: 5px; border-radius: 50%;
    background: currentColor; box-shadow: 0 0 4px currentColor;
  }

  /* Empty */
  .empty-state {
    padding: 4rem 2rem; text-align: center;
    color: var(--text-muted);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem; letter-spacing: 0.2em;
  }
  .empty-state::before {
    content: '[ SIN DATOS RECIBIDOS ]'; display: block;
    font-size: 1rem; color: var(--border-bright); margin-bottom: 0.5rem;
  }

  /* FOOTER */
  .footer {
    border-top: 1px solid var(--border);
    padding: 0.75rem 2.5rem;
    display: flex; align-items: center; justify-content: space-between;
    background: var(--bg-secondary);
  }
  .footer-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem; color: var(--text-muted);
    letter-spacing: 0.15em; text-transform: uppercase;
  }
  .footer-right { display: flex; align-items: center; gap: 1.5rem; }
  .refresh-indicator {
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.62rem; color: var(--text-muted); letter-spacing: 0.1em;
  }
  .refresh-bar {
    width: 60px; height: 2px;
    background: var(--border); position: relative; overflow: hidden;
  }
  .refresh-bar-fill {
    position: absolute; inset: 0;
    background: var(--amber); transform-origin: left;
    animation: refill 3s linear infinite;
  }
  @keyframes refill {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
`;

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="live-clock">
      {time.toISOString().replace('T', ' ').substring(0, 19)} UTC
    </div>
  );
}

function getStats(logs) {
  const total = logs.length;
  const success = logs.filter(l => l.status === 'success').length;
  const errors = logs.filter(l => l.status === 'error').length;
  const withExec = logs.filter(l => l.execution_time != null);
  const avgExec = withExec.length > 0
    ? Math.round(withExec.reduce((a, b) => a + b.execution_time, 0) / withExec.length)
    : 0;
  const lastAction = logs[0]?.action || '—';
  return { total, success, errors, avgExec, lastAction };
}

// Barra de ejecución: max referencia = 3000ms
const MAX_EXEC = 3000;

export default function App() {
  const [logs, setLogs] = useState([]);
  const [connected, setConnected] = useState(false);

  const fetchLogs = () => {
    fetch('http://server-grupo9-umg.duckdns.org:5000/api/logs')
      .then(r => r.json())
      .then(data => { setLogs(data); setConnected(true); })
      .catch(() => setConnected(false));
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = getStats(logs);

  const formatTime = (ts) => {
    const d = new Date(ts);
    return {
      time: d.toLocaleTimeString('es-GT', { hour12: false }),
      date: d.toLocaleDateString('es-GT', { year: 'numeric', month: 'short', day: '2-digit' })
    };
  };

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard">

        {/* HEADER */}
        <header className="header">
          <div className="header-left">
            <div className="header-emblem">
              <div className="header-emblem-inner" />
            </div>
            <div className="header-title">
              <h1>TANK CONTROL SYSTEM</h1>
              <span>GRUPO 9 · UMG · SISTEMAS OPERATIVOS II · 2026</span>
            </div>
          </div>
          <div className="header-right">
            <div className="status-indicator">
              <div className="status-dot" style={{
                background: connected ? 'var(--green)' : 'var(--red)',
                boxShadow: `0 0 8px ${connected ? 'var(--green)' : 'var(--red)'}`
              }} />
              {connected ? 'ENLACE ESTABLECIDO' : 'ENLACE PERDIDO'}
            </div>
            <LiveClock />
          </div>
        </header>

        {/* STATS BAR */}
        <div className="stats-bar">
          <div className="stat-cell">
            <div className="stat-label">Total de Eventos</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-sub">registros totales</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Ops. Exitosas</div>
            <div className="stat-value">{stats.success}</div>
            <div className="stat-sub">
              {stats.total ? Math.round(stats.success / stats.total * 100) : 0}% tasa de éxito
            </div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Errores</div>
            <div className="stat-value">{stats.errors}</div>
            <div className="stat-sub">requieren atención</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Tiempo Prom. Ejec.</div>
            <div className="stat-value">
              {stats.avgExec}
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontFamily: 'Share Tech Mono, monospace' }}>ms</span>
            </div>
            <div className="stat-sub">duración promedio</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">Última Acción</div>
            <div className="stat-value" style={{ fontSize: '0.95rem', paddingTop: '0.2rem' }}>
              {stats.lastAction}
            </div>
            <div className="stat-sub">acción más reciente</div>
          </div>
        </div>

        {/* TABLE */}
        <main className="main-content">
          <div>
            <div className="section-header">
              <div className="section-title">Registro de Eventos del Tanque</div>
              <div className="record-count">{logs.length} REGISTROS · AUTO-REFRESH 3s</div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Componente</th>
                    <th>Acción</th>
                    <th>Tiempo de Ejecución</th>
                    <th>Dispositivo de Origen</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty-state">ESPERANDO TELEMETRÍA DEL TANQUE</div>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log, i) => {
                      const { time, date } = formatTime(log.timestamp);
                      const barWidth = log.execution_time
                        ? Math.min(Math.round((log.execution_time / MAX_EXEC) * 100), 100)
                        : 0;

                      return (
                        <tr key={log._id} style={{ animationDelay: `${i * 0.03}s` }}>

                          {/* Timestamp */}
                          <td className="td-timestamp">
                            {time}
                            <span className="td-date">{date}</span>
                          </td>

                          {/* Componente */}
                          <td>
                            <div className="component-tag">
                              {log.component || '—'}
                            </div>
                          </td>

                          {/* Acción */}
                          <td>
                            <div className="action-tag">
                              {log.action || '—'}
                            </div>
                          </td>

                          {/* Tiempo de ejecución con barra visual */}
                          <td>
                            {log.execution_time != null ? (
                              <div className="exec-bar-wrap">
                                <div className="exec-bar-bg">
                                  <div className="exec-bar-fill" style={{ width: `${barWidth}%` }} />
                                </div>
                                <span className="exec-value">{log.execution_time} ms</span>
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontFamily: 'Share Tech Mono', fontSize: '0.75rem' }}>—</span>
                            )}
                          </td>

                          {/* Dispositivo de origen */}
                          <td>
                            <div className="source-cell">
                              {log.source_device || 'Desconocido'}
                            </div>
                          </td>

                          {/* Estado */}
                          <td>
                            <span className={`status-badge ${log.status}`}>
                              <span className="status-dot-sm" />
                              {log.status === 'success' ? 'Exitoso' : 'Error'}
                            </span>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-text">
            TANK MONITORING SYSTEM v1.0 · ARQUITECTURA DE COMPUTADORAS I · UMG 2026
          </div>
          <div className="footer-right">
            <div className="refresh-indicator">
              <span>SYNC</span>
              <div className="refresh-bar">
                <div className="refresh-bar-fill" />
              </div>
            </div>
            <div className="footer-text">MONGODB · NODE.JS · DOCKER</div>
          </div>
        </footer>

      </div>
    </>
  );
}