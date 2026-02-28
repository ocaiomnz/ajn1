const Sequelize = require('sequelize');

const sequelize = new Sequelize('ajn1_wp', 'ajn1_user', 'MdK?r0oeFyrgt95_', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;
