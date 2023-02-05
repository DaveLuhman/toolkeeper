FROM node:19-alpine as base
WORKDIR /src
COPY . /
EXPOSE 3000
ENV NODE_ENV=PRODUCTION
RUN npm install -g npm@latest
RUN npm install
RUN npm run build:css
COPY . /
CMD ["npm", "start"]