FROM node:24-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --production
COPY . .
RUN npm run build
