FROM node:alpine3.18

WORKDIR /app


COPY package.json package.json

RUN npm install

ENV REDIS_HOST=redis-10635.c212.ap-south-1-1.ec2.cloud.redislabs.com
ENV SECRET=Thisismymostsecuresecret
ENV REDIS_PASSWORD=HCBeMIEP9msIzeq30HNLC7AKDCa7TKtm
ENV REDIS_PORT=10635
ENV DB=mongodb+srv://azeemshaik025:Azeem%404659@cluster0.84u62sl.mongodb.net/EcommerceApp
ENV FRONT_END_URL=http://localhost:3000/

COPY apis apis

COPY controllers controllers

COPY models models

COPY index.js index.js

EXPOSE 3001

CMD [ "node","index.js" ]