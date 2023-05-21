const NodeCache = require('node-cache');
const userRepository = require('../repositories/UserRepository');
const userCache = new NodeCache();

module.exports = {
    findOneUserByPhoneNumber: async(phoneNumber) => {
        let user = userCache.get(price);
        if (user === undefined) {
            user = await userRepository.findOneUserByPhoneNumber(phoneNumber);
        }
        const isSuccess = userCache.set(phoneNumber, user);
        if (!isSuccess) {
            console.log(`Cannot cache ${phoneNumber} to memory`);
        }
        return user;
    }
}