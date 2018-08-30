FROM mhart/alpine-node:10
RUN apk update && apk upgrade && apk add --no-cache bash git openssh
ARG GIT_REV

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "now-start"]

EXPOSE 5000
