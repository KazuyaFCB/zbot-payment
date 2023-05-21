var Sequelize = require('sequelize');
var db = require('../db');

const {DataTypes} = Sequelize;

const userModel = db.define('userModel', {
    phoneNumber: {
        field: 'phone_number',
        type: DataTypes.STRING,
        primaryKey: true
    },
    username: {
        field: 'username',
        type: DataTypes.STRING,
        unique: true
    },
    expiredDate: {
        field: 'expired_date',
        type: DataTypes.DATE
    },
    isBlocked: {
        field: 'is_blocked',
        type: DataTypes.BOOLEAN
    },
    createdDate: {
        field: 'created_date',
        type: DataTypes.DATE,
        defaultValue: Date.now()
    },
    modifiedDate: {
        field: 'modified_date',
        type: DataTypes.DATE,
        defaultValue: Date.now()
    }
}, {
    freezeTableName: true,
    timestamps:false,
    schema: 'zbot',
    tableName: 'user',
    quoteIdentifiers: false
});
(async () => {
    await db.sync()
})();

module.exports = userModel;