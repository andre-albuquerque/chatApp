FROM node:16.16.0-alpine3.16 as builder

WORKDIR /client

COPY package.json .

RUN npm install

ENV NODE_ENV production

COPY . .

RUN npm run build

FROM nginx:1.23.0-alpine

COPY --from=builder /client/build /usr/share/nginx/html

COPY --from=builder /client/nginx.conf /etc/nginx/conf.d/default.conf

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'