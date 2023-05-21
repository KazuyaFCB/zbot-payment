const cassoService = require('./CassoService');
const commonUtil = require('../utils/CommonUtil');
const pricingGrpcClient = require('../grpcClients/PricingGrpcClient');
const userGrpcClient = require('../grpcClients/UserGrpcClient');

module.exports = {
    handleTransaction: async (transactions) => {
        console.log(`Received ${transactions.length} transactions`);

        const pricings = await new Promise((resolve, reject) => {
            pricingGrpcClient.findAllPricings({}, (error, response) => {
                if (error) reject(error);
                else resolve(response.pricings);
            });
        });

        let updatedUsers = [];

        for (let transaction of transactions) {
            // only test
            // transaction.amount = 29000;
            // transaction.description = "CUSTOMER zbot0123456789 Trace 150199";
            // ==============================

            console.log(transaction);
            // Kiểm tra giao dịch còn hạn hay không? Nếu không qua giao dịch tiếp theo
            const currentDate = (new Date()).getTime();
            const transactionDate = (new Date(transaction.when)).getTime();
            if (commonUtil.diffDate(currentDate, transactionDate)
                >= process.env.EXPIRATION_DATE) continue;

            // Lấy sdt từ nội dung giao dịch, nếu không hợp lệ thì qua giao dịch tiếp theo
            // giao dịch từ Casso co format: "CUSTOMER noi_dung Trace 150199"
            // cần lấy ra "noi_dung"
            // quy uoc noi dung la "zbot<PhoneNumber>"". Vd: "zbot0123456789"
            const match = transaction.description.match(/zbot[\d]+[^\d]/);
            if (match === null) continue;
            const mainDescription = match[0];
            const phoneNumber = mainDescription.substring(4, mainDescription.length - 1);

            // Từ amount, check trong pricing list trong memory để lấy ra extended_month
            let extendedMonth = 0;
            pricings.every(pricing => {
                if (transaction.amount < pricing.price) return false;
                extendedMonth = pricing.extendedMonth;
                return true;
            });

            // updatedUsers được dùng để gen ra câu sql bên dưới
            updatedUsers.push({
                "phoneNumber": phoneNumber,
                "extendedMonth": extendedMonth
            });
        }

        await new Promise((resolve, reject) => {
            userGrpcClient.updateUserByPhoneNumberAndExtendedMonth({
                "updatedUsers": updatedUsers
            }, (error, _) => {
                if (error) reject(error);
                else resolve();
            });
        });
    },
    syncTransactionByAccountNumber: async (accountNumber) => {
        //Tiến hành gọi hàm đồng bộ qua casso
        const res = await cassoService.syncTransaction(accountNumber);
        return res;
    },

    // 2 hàm dưới chưa cần quan tâm
    getTransactions: async () => {
        const res = await cassoService.getTransactions({ params: "page=1" });
        return res;
    },
    registerWebhook: async () => {
        //Delete Toàn bộ webhook đã đăng kí trước đó với /webhook/handler-bank-transfer
        await cassoService.deleteWebhookByUrl(
            `${process.env.DOMAIN_NAME}/webhook/handler-bank-transfer`);
        //Tiến hành tạo webhook
        let data = {
            webhook: `${process.env.DOMAIN_NAME}/webhook/handler-bank-transfer`,
            secure_token: process.env.SECURE_TOKEN,
            income_only: true
        }
        let newWebhook = await cassoService.createWebhook(data);
        // Lấy thông tin về userInfo
        let userInfo = await cassoService.getDetailUser();
        return {
            webhook: newWebhook.data,
            userInfo: userInfo.data
        }
    }
}