FROM node:20.11.0
LABEL authors="MinhNguyen"

WORKDIR /react-frontend/

COPY public/                /react-frontend/public
COPY src/                   /react-frontend/src
COPY package.json/          /react-frontend/
COPY package-lock.json/     /react-frontend/
COPY tsconfig.json/         /react-frontend/

RUN npm install
RUN npm run build
RUN npm i -S serve

CMD npx serve -s build