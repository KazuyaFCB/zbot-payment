const Sequelize = require('sequelize');
const db = require('../config/db');

const {DataTypes} = Sequelize;

const pricingModel = db.define('pricingModel', {
    price: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        field: 'price'
    },
    extendedMonth: {
        type: DataTypes.NUMBER,
        field: 'extended_month'
    },
}, {
    freezeTableName: true,
    timestamps:false,
    schema: 'zbot',
    tableName: 'pricing',
    quoteIdentifiers: false
});
(async () => {
    await db.sync()
})();

module.exports = pricingModel;