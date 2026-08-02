FROM node:20-slim

# Instalar openssl para compatibilidad nativa con los motores de base de datos de Prisma
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Forzar la generación del cliente Prisma dentro del contenedor durante la construcción
RUN npx prisma generate --schema=node_modules/@mastra/core/dist/prisma/schema.prisma

RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
