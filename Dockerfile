# Usa la imagen oficial de Node.js 20.13.1 como base
FROM node:20.13.1-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia todos los archivos de la aplicación al directorio de trabajo
COPY . .

# Compila la aplicación NestJS
#RUN npm run build

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 80

# Comando para iniciar la aplicación
CMD ["npm", "start", "dev"]
