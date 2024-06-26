FROM node:14.17.3-alpine3.14

WORKDIR /usr/src/app

COPY ./package.json ./

RUN yarn install

COPY [".", "./"]

EXPOSE 3000

CMD ["yarn", "start"]