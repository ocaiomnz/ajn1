const sequelize = process.env.NODE_ENV === 'production' 
    ? require('../config/database-production') 
    : require('../config/database');

// Import models
const Article = require('./Article')(sequelize);
const Category = require('./Category')(sequelize);
const User = require('./User')(sequelize);
const Ad = require('./Ad')(sequelize);
const Classified = require('./Classified')(sequelize);
const Columnist = require('./Columnist')(sequelize);
const LegalPublication = require('./LegalPublication')(sequelize);

// Associations
Category.hasMany(Article, { foreignKey: 'categoryId' });
Article.belongsTo(Category, { foreignKey: 'categoryId' });

Columnist.hasMany(Article, { foreignKey: 'columnistId' });
Article.belongsTo(Columnist, { foreignKey: 'columnistId' });

module.exports = {
    sequelize,
    Article,
    Category,
    User,
    Ad,
    Classified,
    Columnist,
    LegalPublication
};
