# Audit app

> A Node.js project with ( Express.js, Passport.js, Sequelize, Joi)

## Server Build Setup

``` bash
# first what you need - start the server. go to the /server folder
cd ./server

# install package dependencies
npm install

# rename .env.example to .env and fill in this file settings
mv .env.example .env

# run migration script to create tables in the database
npx sequelize db:migrate

# now we can start the server. Use command below to start the server
npm run start

#use dev command to hot reload the server after file changes
npm run dev
```
