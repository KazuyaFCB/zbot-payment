const axios = require("axios");
const queryString =  require("query-string");
const cassoRestClient = axios.create({
  baseURL: 'https://oauth.casso.vn/v2',
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

cassoRestClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  return config;
});

cassoRestClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    if (error["response"]["data"])
      return error.response.data;
    throw error;
  }
);

module.exports =  cassoRestClient;
