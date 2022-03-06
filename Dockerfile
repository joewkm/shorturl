FROM node:12-alpine
WORKDIR /shorturl
COPY . .
RUN yarn install --production
CMD ["node", "/shorturl/index.js"]
EXPOSE 4001