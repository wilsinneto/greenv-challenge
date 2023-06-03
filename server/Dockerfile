FROM node:16.20.0

WORKDIR /usr/src/app

COPY package*.json ./
COPY .env ./

RUN npm ci --only=production

COPY . .