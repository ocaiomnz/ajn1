const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

const Article = sequelize.define('Article', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    excerpt: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    columnistId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    isColumn: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

return Article;
};
