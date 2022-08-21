FROM node:16.16.0-alpine3.16

WORKDIR /server

COPY package.json .

RUN npm install

ENV NODE_ENV production

EXPOSE 8081

COPY . .

RUN npm install pm2 --location=global --unsafe-perm=true --allow-root

CMD ["npm", "start"]
