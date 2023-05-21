var express = require('express');
var indexController = express.Router();

const restService = require('../services/RestService');
const paymentService = require('../services/PaymentService');
// const userGrpcClient = require('../grpcClients/UserGrpcClient');
// const pricingGrpcClient = require('../grpcClients/PricingGrpcClient');

/* GET home page. */
indexController.get('/', async function (req, res, next) {
  console.log("test get method");

  return restService.getSuccessResponse(res, null, 'success');
  //res.render('index', { title: 'Express' });
});

indexController.post('/', async function (req, res, next) {
  console.log(`test post method, ${JSON.stringify(req.body)}`);

  const transactions = [
    {
      "amount": 29000,
      "description": "CUSTOMER zbot01 Trace 150199"
    },
    {
      "amount": 69000,
      "description": "CUSTOMER zbot02 Trace 150199"
    }
  ];

  try {
    await paymentService.handleTransaction(transactions);
    return restService.getSuccessResponse(res, null, 'success');
  } catch (error) {
    return restService.getServerErrorResponse(res);
  }


  // await new Promise((resolve, reject) => {
  //   userGrpcClient.updateUserByPhoneNumberAndExtendedMonth({
  //     "updatedUsers": [{
  //       "phoneNumber": "N01",
  //       "extendedMonth": "1"
  //     }]
  //   }, (error, user) => {
  //     if (error) reject(error);
  //     else {
  //       console.log("updateUserByPhoneNumberAndExtendedMonth");
  //       resolve();
  //     }
  //   });
  // });
  // await new Promise((resolve, reject) => {
  //   pricingGrpcClient.findOnePricingByPrice({ "price": "N01" }, (error, response) => {
  //     if (error) reject(error);
  //     else {
  //       console.log(`Pricing: ${JSON.stringify(response.pricing)}`);
  //       resolve(response.pricing);
  //     }
  //   });
  // });
  // await new Promise((resolve, reject) => {
  //   userGrpcClient.findOneUserByPhoneNumber({ "phoneNumber": "01" }, (error, response) => {
  //     if (error) {
  //       reject(error);
  //     } else {
  //       console.log(`User: ${JSON.stringify(response.user)}`);
  //       resolve(response.user);
  //     }
  //   });
  // });
  // await new Promise((resolve, reject) => {
  //   pricingGrpcClient.findAllPricings({}, (error, response) => {
  //     if (error) reject(error);
  //     else {
  //       console.log(`PricingList: ${JSON.stringify(response.pricings)}`);
  //       resolve(response.pricings);
  //     }
  //   });
  // });
  // await new Promise((resolve, reject) => {
  //   pricingGrpcClient.findOnePricingByPrice({ "price": "29000" }, (error, response) => {
  //     if (error) reject(error);
  //     else {
  //       console.log(`Pricing: ${JSON.stringify(response.pricing)}`);
  //       resolve(response.pricing);
  //     }
  //   });
  // });
  // return restService.getSuccessResponse(res, null, 'success');
});

module.exports = indexController;
