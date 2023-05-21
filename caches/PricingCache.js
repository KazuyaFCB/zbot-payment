const NodeCache = require('node-cache');
const pricingRepository = require('../repositories/PricingRepository');
const pricingCache = new NodeCache();

module.exports = {
    findAllPricing: async () => {
        let pricingList = pricingCache.get("pricingList");
        if (pricingList === undefined) {
            pricingList = await pricingRepository.findAllPricing();
        }
        const isSuccess = pricingCache.set("pricingList", pricingList);
        if (!isSuccess) {
            console.log(`Cannot cache pricingList to memory`);
        }
        return pricingList;
    },

    findOnePricingByPrice: async (price) => {
        let pricing = pricingCache.get(price);
        if (pricing === undefined) {
            pricing = await pricingRepository.findOnePricingByPrice(price);
        }
        const isSuccess = pricingCache.set(price, pricing);
        if (!isSuccess) {
            console.log(`Cannot cache ${price} to memory`);
        }
        return pricing;
    }
}