const cron = require('node-cron');
const paymentService = require('../services/PaymentService');
const commonUtil = require('../utils/CommonUtil');

// will sync every 75s
// it means every 300s will run cron, and in each cron, loop 4 times with 75s
// const task = cron.schedule('*/5 * * * *', async () => {
//     for (let i=1;i<=4;i++) {
//         console.log(`Sync casso at: ${new Date()}`);
//         const cassoDto = await paymentService.syncTransactionByAccountNumber(
//             process.env.MY_BANK_ACCOUNT_NUMBER);
//         console.log(`${JSON.stringify(cassoDto)}`);
//         await commonUtil.sleep(75000);
//     }
// }, {
//     scheduled: true,
// });

// will sync every 120s
const task = cron.schedule('*/2 * * * *', async () => {
    console.log(`Sync casso at: ${new Date()}`);
    const cassoDto = await paymentService.syncTransactionByAccountNumber(
        process.env.MY_BANK_ACCOUNT_NUMBER);
    console.log(`${JSON.stringify(cassoDto)}`);
}, {
    scheduled: false,
});

module.exports = {
    startJob: () => {
        task.start();
    },
    stopJob: () => {
        task.stop();
    }
}