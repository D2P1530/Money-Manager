FROM node:20-alpine
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm install --build-from-source
COPY . .
RUN npx prisma generate
RUN npm run build
CMD sh -c "npx prisma migrate deploy && node dist/src/main.js"