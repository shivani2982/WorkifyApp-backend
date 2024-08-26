FROM node:18.18.2-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npm i nodemon -g
RUN npx prisma
RUN npx prisma generate
RUN npx prisma migrate dev --name migration_workifyDb
COPY . .

EXPOSE 5000

CMD ["npm", "run", "start"]