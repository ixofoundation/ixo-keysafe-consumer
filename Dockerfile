# create a file named Dockerfile
FROM node:latest
RUN mkdir /usr/src/ixoks
WORKDIR /usr/src/ixoks
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]