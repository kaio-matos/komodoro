FROM node:22.16.0
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

CMD [ "npm","run","dev" ]
