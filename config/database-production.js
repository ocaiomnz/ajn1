const Sequelize = require('sequelize');
const path = require('path');

// Para produção, podemos usar SQLite com melhor configuração
// ou migrar para MySQL quando o banco estiver disponível

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database-production.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;
