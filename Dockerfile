FROM node:18.14.2
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3000
EXPOSE 80 
CMD [ "node", "app.js" ]
