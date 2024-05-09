FROM node:20.11.1-alpine AS builder
WORKDIR /app
COPY package*.json angular.json tsconfig*.json ./
COPY src ./src
RUN npm install && ./node_modules/.bin/ng build

FROM nginx:1.25.3-alpine as application
COPY --from=builder /app/dist/stealthy-users-ui/browser /usr/share/nginx/html
COPY ./build/default.conf /etc/nginx/conf.d/
