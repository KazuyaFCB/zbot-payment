const express = require('express');
const paymentController = express.Router();
const paymentService = require('../services/PaymentService');
const restService = require('../services/RestService');
const syncCassoCronJob = require('../cronJobs/syncCassoCronJob');

// Webhook để nhận thông tin giao dịch từ Casso
paymentController.route('/webhook/handler-bank-transfer').post(async (req, res, next) => {
    try {
        const error = req.body.error;
        if (error != 0) {
            return restService.getServerErrorResponse(res);
        }

        const transactions = req.body.data;
        await paymentService.handleTransaction(transactions);

        return restService.getSuccessResponse(res, null, 'success');
    } catch (error) {
        console.log(error);
        next(error);
    }
});

paymentController.route('/start-sync-casso-cron-job').post((req, res, next) => {
    try {
        syncCassoCronJob.startJob();
        return restService.getSuccessResponse(res, null, 'success');
    } catch (error) {
        next(error);
    }
});

paymentController.route('/stop-sync-casso-cron-job').post((req, res, next) => {
    try {
        syncCassoCronJob.stopJob();
        return restService.getSuccessResponse(res, null, 'success');
    } catch (error) {
        next(error);
    }
});

paymentController.route('/transactions').post(async (req, res, next) => {
    try {
        const cassoDto = await paymentService.getTransactions();
        if (cassoDto.error != 0) {
            return restService.getServerErrorResponse(res);
        }
        const totalRecords = cassoDto.data.totalRecords;
        const transactions = cassoDto.data.records;
        console.log(`Total records: ${totalRecords}`)
        console.log(`Transactions: ${JSON.stringify(transactions)}`);
        return restService.getSuccessResponse(res, null, 'success');
    } catch (error) {
        console.log(error);
        next(error);
    }
});

/* Route này sẽ thực hiện đăng kí webhook dựa vào API KEY 
và lấy thông tin về business và banks */
paymentController.route('/register-webhook').post(async (req, res, next) => {
    try {
        const data = await paymentService.registerWebhook();
        return restService.getSuccessResponse(res, data, 'success');
    } catch (error) {
        next(error);
    }
})

module.exports = paymentController;
