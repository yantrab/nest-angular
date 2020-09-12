FROM node:13

WORKDIR /usr/src/app

COPY package.json ./

COPY ../../config.ts ../../

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "start"]