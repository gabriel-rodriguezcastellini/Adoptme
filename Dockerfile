FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm rebuild bcrypt --build-from-source

EXPOSE 8080

ENV NODE_ENV=production

CMD ["npm", "start"]