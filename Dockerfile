FROM node:14-alpine3.12

WORKDIR /usr/src/app

COPY [".", "."]

RUN npm i
RUN npm run build

CMD ["npm", "run", "start:prod"]
