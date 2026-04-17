# Etapa 1: Construcción
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor de producción
FROM nginx:stable-alpine
# Copiamos los archivos construidos de React a Nginx
COPY --from=build /app/build /usr/share/nginx/html
# Exponemos el puerto 80 (estándar web)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]