# 🪖 Tank Control System — Servidor de Monitoreo de Eventos

**Universidad Mariano Gálvez — Centro Universitario de Chimaltenango**  
**Curso:** Sistemas Operativos II  
**Grupo 9**

---

## 📡 Acceso al Sistema

| Servicio | URL |
|---|---|
| **Dashboard (Frontend)** | http://server-grupo9-umg.duckdns.org |
| **API Backend** | http://server-grupo9-umg.duckdns.org:5000/api/logs |
| **Base de Datos** | mongodb://server-grupo9-umg.duckdns.org:27017 |

> El sistema está alojado en un servidor físico (PC dedicada) con Ubuntu Server 24.04 LTS, expuesto a internet mediante DuckDNS como proveedor de DNS dinámico.

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    SERVIDOR FÍSICO                       │
│                  Ubuntu Server 24.04                     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Docker Compose                      │   │
│  │                                                  │   │
│  │  ┌──────────────┐    ┌──────────────┐           │   │
│  │  │   Frontend   │    │   Backend    │           │   │
│  │  │    (Nginx)   │    │  (Node.js)   │           │   │
│  │  │   Puerto 80  │    │  Puerto 5000 │           │   │
│  │  └──────────────┘    └──────┬───────┘           │   │
│  │                             │                    │   │
│  │                    ┌────────▼───────┐            │   │
│  │                    │   MongoDB      │            │   │
│  │                    │  Puerto 27017  │            │   │
│  │                    └───────────────┘            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         ▲                        ▲
         │                        │
   Navegador Web           Robot Tanque
   (Dashboard)          (Arduino + Bluetooth)
```

**Flujo de datos:**
1. El robot tanque genera eventos (movimientos, disparos, etc.)
2. Los eventos se envían al **Backend** vía HTTP POST
3. El **Backend** valida y persiste los eventos en **MongoDB**
4. El **Frontend** consulta el Backend cada 3 segundos y muestra los logs en tiempo real

---

## 🛠️ Tecnologías Utilizadas

### Servidor
| Componente | Tecnología |
|---|---|
| Sistema Operativo | Ubuntu Server 24.04 LTS |
| Orquestación | Docker Compose |
| DNS Dinámico | DuckDNS |
| Red | WiFi con NetworkManager |

### Backend
| Componente | Tecnología |
|---|---|
| Runtime | Node.js 18 (Alpine) |
| Framework | Express.js |
| ODM | Mongoose |
| CORS | cors |

### Base de Datos
| Componente | Tecnología |
|---|---|
| Motor | MongoDB (latest) |
| Persistencia | Volumen Docker (`./data/db`) |

### Frontend
| Componente | Tecnología |
|---|---|
| Framework | React 18 |
| Servidor web | Nginx 1.30 |
| Tipografías | Google Fonts (Orbitron, Rajdhani, Share Tech Mono) |

---

## 📦 Contenedores Docker

El sistema utiliza **3 contenedores** orquestados con Docker Compose:

| Contenedor | Imagen | Puerto | Descripción |
|---|---|---|---|
| `backend_logs` | `proyecto-final-servidor-backend` | `5000` | API REST Node.js |
| `db_mongo_proyecto` | `mongo:latest` | `27017` | Base de datos MongoDB |
| `frontend_dashboard` | `proyecto-final-servidor-frontend` | `80` | Dashboard React + Nginx |

---

## 📋 Estructura del Registro de Eventos (Log)

Cada evento generado por el robot contiene los siguientes campos:

| Campo | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `timestamp` | Date | Fecha y hora de ejecución | `2026-05-22T03:28:14.962Z` |
| `component` | String | Componente físico que ejecutó la acción | `"Ruedas"`, `"Cañón"`, `"Torreta"` |
| `action` | String | Nombre descriptivo de la acción | `"Movimiento Adelante"`, `"Disparo"` |
| `execution_time` | Number | Duración en ms que se mantuvo la acción | `1500` |
| `source_device` | String | Dispositivo que originó el evento | `"Samsung Galaxy S21 - App Bluetooth"` |
| `status` | String | Resultado de la acción | `"success"` o `"error"` |

---

## 🔌 API Endpoints

### `POST /api/logs`
Recibe y almacena un nuevo evento del robot.

**Body (JSON):**
```json
{
  "component": "Cañón",
  "action": "Disparo",
  "execution_time": 800,
  "source_device": "Samsung Galaxy S21 - App Bluetooth",
  "status": "success"
}
```

**Respuesta exitosa (201):**
```json
{
  "_id": "69eed7ceb493192cc1854d9f",
  "component": "Cañón",
  "action": "Disparo",
  "execution_time": 800,
  "source_device": "Samsung Galaxy S21 - App Bluetooth",
  "status": "success",
  "timestamp": "2026-05-22T03:28:14.962Z",
  "__v": 0
}
```

### `GET /api/logs`
Retorna los últimos 50 eventos ordenados por fecha descendente.

### `DELETE /api/logs`
Elimina todos los eventos almacenados en la base de datos.

---

## 🚀 Instrucciones de Uso

### Requisitos previos
- Docker y Docker Compose instalados
- Git instalado
- Archivo `.env` configurado (ver sección siguiente)

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/proyecto-final-servidor.git
cd proyecto-final-servidor
```

### 2. Crear el archivo `.env`
```bash
nano .env
```

Contenido del `.env`:
```env
MONGO_URI=mongodb://mongodb:27017/TankDB
BACKEND_PORT=5000
FRONTEND_PORT=80
SERVER_IP=server-grupo9-umg.duckdns.org
DB_PORT=27017
```

### 3. Levantar los contenedores
```bash
sudo docker compose up -d --build
```

### 4. Verificar que todo esté corriendo
```bash
sudo docker compose ps
```

### 5. Acceder al dashboard
Abre en tu navegador:
```
http://server-grupo9-umg.duckdns.org
```

---

## 🧪 Simulador de Eventos

El proyecto incluye un simulador (`simulador.js`) para probar el sistema sin el robot físico:

```bash
node simulador.js
```

El simulador envía eventos aleatorios cada 3 segundos con componentes, acciones, tiempos de ejecución y dispositivos de origen variados.

---

## 🔧 Comandos de Administración

### Ver logs de un contenedor
```bash
sudo docker logs backend_logs
sudo docker logs db_mongo_proyecto
sudo docker logs frontend_dashboard
```

### Detener el sistema
```bash
sudo docker compose down
```

### Reiniciar un contenedor específico
```bash
sudo docker compose restart backend
```

### Pausar/reanudar contenedores (para demostración)
```bash
# Pausar
sudo docker pause backend_logs
sudo docker pause db_mongo_proyecto
sudo docker pause frontend_dashboard

# Reanudar
sudo docker unpause backend_logs
sudo docker unpause db_mongo_proyecto
sudo docker unpause frontend_dashboard
```

---

## 📁 Estructura del Proyecto

```
proyecto-final-servidor/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js          # API REST Express + Mongoose
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── App.js         # Dashboard React
├── data/                  # Volumen MongoDB (generado automáticamente)
├── simulador.js           # Simulador de eventos del tanque
├── docker-compose.yml     # Orquestación de contenedores
└── README.md
```

---

## 👥 Integrantes del Grupo 9

| Rol | Responsabilidad |
|---|---|
| Líder del proyecto e integración | Coordinación y documentación |
| Responsable de hardware | Diseño físico del tanque y Arduino |
| Responsable de App Móvil | Aplicación Bluetooth |
| Responsable de comunicación USB | Monitoreo serial |
| Responsable del servidor | Backend, MongoDB, Docker, Dashboard |

---

*Universidad Mariano Gálvez — Centro Universitario de Chimaltenango — 2026*
