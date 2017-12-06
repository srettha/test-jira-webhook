FROM node:latest
LABEL maintainer="strayedpeople@gmail.com"
COPY . /app
WORKDIR /app
RUN npm i --production
CMD ["node", "app.js"]