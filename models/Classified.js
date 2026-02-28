const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Classified = sequelize.define('Classified', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'geral'
        },
        contactName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contactPhone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contactEmail: {
            type: DataTypes.STRING,
            allowNull: true
        },
        images: {
            type: DataTypes.TEXT,
            get() {
                const value = this.getDataValue('images');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('images', JSON.stringify(value || []));
            }
        },
        status: {
            type: DataTypes.ENUM('active', 'sold', 'expired'),
            defaultValue: 'active'
        },
        featured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'classifieds',
        timestamps: true
    });

    return Classified;
};
