# Imagen base con Node.js
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Exponer el puerto de la API
EXPOSE 3000

# Comando para desarrollo
CMD ["npm", "run", "dev"]
