const statusCode = require('../utils/StatusCode');

module.exports = {
    getSuccessResponse: (res, data, message) => {
        return res.status(statusCode.SUCCESS_CODE).json({
            code: statusCode.SUCCESS_CODE,
            message: message,
            data: data,
            error: 0
        })
    },
    getNotFoundResponse: (res, message) => {
        return res.status(statusCode.NOT_FOUND_CODE).json({
            code: statusCode.NOT_FOUND_CODE,
            message: message,
            error: 1
        })
    },
    getUnauthorizedReponse: (res, message) => {
        return res.status(statusCode.UNAUTHORIZED_CODE).json({
            code: statusCode.UNAUTHORIZED_CODE,
            message: message,
            error: 1
        });
    },
    getServerErrorResponse: (res) => {
        return res.status(statusCode.SERVER_ERROR_CODE).json({
            code: statusCode.SERVER_ERROR_CODE,
            message: "Server error!",
            error: 1
        })
    }
}