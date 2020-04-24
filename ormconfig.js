const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;

module.exports={
   "type": process.env.DB_DRIVER,
   "host": process.env.DB_HOST,
   "port": process.env.DB_PORT,
   "username": process.env.DB_USERNAME,
   "password": process.env.DB_PASS,
   "database": process.env.DB_NAME,
   "synchronize": true,
   "logging": false,
   "namingStrategy": new SnakeNamingStrategy(),
   "entities": [
      "dist/entity/**/*.js"
   ],
   "migrations": [ 
      "dist/migration/**/*.js"
   ],
   "subscribers": [
      "dist/subscriber/**/*.js"
   ],
   "cli": {
      "entitiesDir": "dist/entity",
      "migrationsDir": "dist/migration",
      "subscribersDir": "dist/subscriber"
   }
}