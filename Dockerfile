FROM node:20-alpine AS base
WORKDIR /src
COPY . /
EXPOSE 3000
ENV NODE_ENV=PRODUCTION
LABEL org.opencontainers.image.description="toolKeeper by ADO Software"
LABEL org.opencontainers.image.authors="Dave Luhman, <<dave@ado.software>>"
LABEL org.opencontainers.image.url="https://ghcr.io/daveluhman/toolkeeper"
LABEL org.opencontainers.image.source="https://github.com/daveluhman/toolkeeper"
LABEL org.opencontainers.image.version="v1.3.0"
RUN npm install --omit dev
RUN npm run build:css
CMD ["npm", "start"]