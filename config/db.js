var Sequelize = require('sequelize').Sequelize;

const db = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, 
{
    host: process.env.DB_HOST,
    dialect: "postgres",
    // operatorsAliases: false,
    quoteIdentifiers: false,
    //freezeTableName: true,
    pool: {
        max: 15,
        min: 5,
        idle: 20000,
        evict: 15000,
        acquire: 30000
    },
    dialectOptions: {
        ssl: {
          require: true, // This will help you. But you will see nwe error
          rejectUnauthorized: false // This line will fix new error
        }
    }
});

module.exports = db;