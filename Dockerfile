FROM node:14.18.0

WORKDIR /usr/src/app

COPY [".", "."]

RUN npm i
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
