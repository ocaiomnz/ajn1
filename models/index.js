const sequelize = require('../config/database');
const Article = require('./Article');
const Category = require('./Category');
const User = require('./User');
const Ad = require('./Ad');

// Associations
Category.hasMany(Article, { foreignKey: 'categoryId' });
Article.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = {
    sequelize,
    Article,
    Category,
    User,
    Ad
};
