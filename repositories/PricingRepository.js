var pricingModel = require('../models/PricingModel');

module.exports = {
  findAllPricing: async () => {
    let result = await pricingModel.findAll(
      {
        order: [['price', 'ASC']]
      }
    );
    var pricingList = result.map(pricingItem => pricingItem.dataValues);
    return pricingList;
  },

  findOnePricingByPrice: async (price) => {
    var result = await pricingModel.findOne(
        {
          where: {
            price: price
          },
          attributes: ['price', 'extendedMonth']
        }
      );
      if (result === null) return null;
      return result.dataValues;
  }
}