FROM node:22-alpine

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app

RUN chmod +x /app/entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["/app/entrypoint.sh"]
