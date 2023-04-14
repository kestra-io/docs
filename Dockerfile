FROM node:18
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/app
COPY .output/ .
EXPOSE 3000
CMD ["node", "server/index.mjs"]
