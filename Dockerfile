FROM node:22-alpine AS base
WORKDIR /src
COPY . /
EXPOSE 3000
ENV NODE_ENV=PRODUCTION
LABEL org.opencontainers.image.description="ToolKeeper by ADO Software"
LABEL org.opencontainers.image.authors="Dave Luhman, <<dave@ado.software>>"
LABEL org.opencontainers.image.url="https://ghcr.io/daveluhman/toolkeeper"
LABEL org.opencontainers.image.source="https://github.com/daveluhman/toolkeeper"
LABEL org.opencontainers.image.version="v2.0.1"
RUN npm install
RUN npm run build:css
CMD ["npm", "start"]