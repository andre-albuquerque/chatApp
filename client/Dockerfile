FROM node:16.16.0-alpine3.16 as builder

WORKDIR /client

COPY package.json .

RUN npm install

ENV NODE_ENV production

COPY . .

ARG REACT_APP_BACKEND 

ENV REACT_APP_BACKEND=${REACT_APP_BACKEND} 

RUN REACT_APP_BACKEND=${REACT_APP_BACKEND} \
    && npm run build

FROM nginx:1.23.0-alpine

COPY --from=builder /client/build /usr/share/nginx/html

COPY --from=builder /client/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /client/nginx.conf /etc/nginx/sites-available/default.conf

WORKDIR /etc/nginx/sites-enabled

RUN apk add sudo nano

RUN sudo ln -s /etc/nginx/sites-available/default.conf default.conf

EXPOSE $PORT

CMD sed -i -e 's/$PORT/'"$PORT"'/g' -e 's/$REACT_APP_BACKEND/'"$REACT_APP_BACKEND"'/g' /etc/nginx/conf.d/default.conf \
    && sed -i -e 's/$PORT/'"$PORT"'/g' -e 's/$REACT_APP_BACKEND/'"$REACT_APP_BACKEND"'/g' /etc/nginx/sites-available/default.conf \
    && nginx -g 'daemon off;'
