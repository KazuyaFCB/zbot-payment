var userModel = require('../models/UserModel');

module.exports = {
  findAllUsers: async () => {
    let result = await userModel.findAll(
      {
        limit: 50,
        order: [['phoneNumber', 'ASC']]
      }
    );
    var userList = result.map(userItem => userItem.dataValues);
    return userList;
  },

  findOneUserByPhoneNumber: async(phoneNumber) => {
    var result = await userModel.findOne(
      {
        where: {
          phoneNumber: phoneNumber,
          // expiredDate: {
          //   $gt: new Date()
          // },
          isBlocked: false
        },
        attributes: ['phoneNumber', 'username', 'expiredDate', 'isBlocked']
      }
    );
    if (result === null) return null;
    return result.dataValues;
  },

  createOneUser: async (username) => {
    await userModel.create(
      {
        phoneNumber: username,
        username: username,
        isBlocked: false
      }
    );
  },

  updatePhoneNumberByUsername: async (phoneNumber, username) => {
    await userModel.update(
      {
        phoneNumber: phoneNumber
      }, {
      where: {
        username: username
      }
    }
    );
  },

  updateExpiredDateByUsernameAndExtendedMonth: async (phoneNumber, extendedMonth) => {
    await userModel.update(
      {
        expiredDate: null
      }, {
      where: {
        username: username
      }
    }
    );
  }
}