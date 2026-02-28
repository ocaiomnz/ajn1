const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const LegalPublication = sequelize.define('LegalPublication', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('edital', 'licitacao', 'aviso', 'declaracao', 'outro'),
            defaultValue: 'aviso'
        },
        entity: {
            type: DataTypes.STRING,
            allowNull: false
        },
        publicationDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        validityDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        documentNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'expired', 'suspended'),
            defaultValue: 'active'
        },
        pdfUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        contactInfo: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'legal_publications',
        timestamps: true
    });

    return LegalPublication;
};
