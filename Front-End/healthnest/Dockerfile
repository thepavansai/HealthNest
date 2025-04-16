
FROM node:alpine
WORKDIR /app
COPY package.json .
#RUN npm i
RUN npm install
COPY . .
CMD ["npm", "start"]

EXPOSE 3000
