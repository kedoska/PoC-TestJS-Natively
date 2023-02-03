FROM node:19-alpine3.16

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
COPY test /app/test

RUN npm install

CMD ["npm", "test"]
