FROM node:18-alpine as base
WORKDIR /src
COPY . /
EXPOSE 3000
ENV NODE_ENV=PRODUCTION
RUN npm install -g npm@latest
RUN npm ci
COPY . /
CMD ["npm", "start"]