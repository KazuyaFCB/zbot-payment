var express = require('express');
var indexController = express.Router();

const restService = require('../services/RestService');
const pricingCache = require('../caches/PricingCache');

/* GET home page. */
indexController.get('/', async function (req, res, next) {
  console.log("test get method");

  return restService.getSuccessResponse(res, null, 'success');
  //res.render('index', { title: 'Express' });
});

indexController.post('/', async function (req, res, next) {
  console.log(`test post method, ${JSON.stringify(req.body)}`);

  return restService.getSuccessResponse(res, null, 'success');
  //res.render('index', { title: 'Express' });
});

module.exports = indexController;
