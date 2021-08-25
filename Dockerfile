FROM node

WORKDIR /app

COPY . .

EXPOSE 5000

RUN npm install

RUN apt-get install git

CMD ["npm", "run", "docker"]