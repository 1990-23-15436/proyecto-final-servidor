# Usamos una imagen ligera de Node.js
FROM node:18-alpine

# Creamos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias primero para aprovechar el cache de Docker
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código del backend
COPY . .

# Exponemos el puerto 5000 (el que definimos en el .env anteriormente)
EXPOSE 5000

# Comando para iniciar la aplicación
CMD ["npm", "start"]