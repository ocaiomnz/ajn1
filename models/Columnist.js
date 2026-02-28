const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Columnist = sequelize.define('Columnist', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        socialMedia: {
            type: DataTypes.TEXT,
            get() {
                const value = this.getDataValue('socialMedia');
                return value ? JSON.parse(value) : {};
            },
            set(value) {
                this.setDataValue('socialMedia', JSON.stringify(value || {}));
            }
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'opiniao'
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'columnists',
        timestamps: true,
        hooks: {
            beforeCreate: (columnist) => {
                if (columnist.name) {
                    columnist.slug = columnist.name.toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim('-');
                }
            },
            beforeUpdate: (columnist) => {
                if (columnist.changed('name')) {
                    columnist.slug = columnist.name.toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim('-');
                }
            }
        }
    });

    return Columnist;
};
