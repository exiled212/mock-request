FROM node:14.18.0

WORKDIR /usr/src/app

COPY [".", "."]

RUN npm run build

WORKDIR /usr/src/app/dist

EXPOSE 3000

CMD ["node", "main.js"]
