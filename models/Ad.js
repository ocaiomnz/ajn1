const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ad = sequelize.define('Ad', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true // If null, use icon/text
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true // For text-based ads
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false
    },
    position: {
        type: DataTypes.ENUM('header', 'sidebar', 'content'),
        defaultValue: 'sidebar'
    },
    type: {
        type: DataTypes.ENUM('image', 'text'),
        defaultValue: 'text'
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true
    },
    label: {
        type: DataTypes.STRING,
        defaultValue: 'PUBLICIDADE'
    }
});

module.exports = Ad;
