const restService = require('../services/RestService');

module.exports = {
    verifySecureToken: (req, res, next) => {
        if (!req.header('secure-token')
            || req.header('secure-token') != process.env.SECURE_TOKEN) {
            return restService.getUnauthorizedReponse(res,
                'Missing secure-token or wrong secure-token');
        }
        next();
    }
}