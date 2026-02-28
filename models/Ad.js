const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Ad = sequelize.define('Ad', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        position: {
            type: DataTypes.ENUM('header', 'sidebar', 'footer', 'middle'),
            defaultValue: 'sidebar'
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'ads',
        timestamps: true
    });

    return Ad;
};
