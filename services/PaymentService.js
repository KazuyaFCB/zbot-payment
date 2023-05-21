const cassoService = require('./CassoService');
const commonUtil = require('../utils/CommonUtil');
const pricingCache = require('../caches/PricingCache');
const userCache = require('../caches/UserCache');

module.exports = {
    handleTransaction: async (transactions) => {
        console.log(`Received ${transactions.length} transactions`);
        let updatedUsers = [];

        for (let transaction of transactions) {
            transaction.amount=29000;
            transaction.description = "CUSTOMER zbot0123456789 Trace 150199";

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

            // Từ amount query pricing table trong memory để lấy ra extended_month
            const pricingList = await pricingCache.findAllPricing();
            let extendedMonth = 0;
            pricingList.every(pricing => {
                if (transaction.amount < pricing.price) return false;
                extendedMonth = pricing.extendedMonth;
                return true;
            });

            // updatedUsers duoc dung de gen ra cau sql ben duoi
            updatedUsers.push({
                phoneNumber: phoneNumber,
                extendedMonth: extendedMonth
            });
            console.log(
                `update expired_date trong table user cho phone_number: ${phoneNumber}`);
        }
        // update expired_date trong table user
            
        /*
        case 1:
        expire < now => expire = now + extend
        case 2:
        expire >= now => expire = expire + extend

        // gen ra SQL:

        UPDATE zbot.user 
        SET expired_date = CASE
            WHEN phone_number = 'N01' THEN (GREATEST(CURRENT_DATE, expired_date) + INTERVAL '1 month')
            WHEN phone_number = 'N02' THEN (GREATEST(CURRENT_DATE, expired_date) + INTERVAL '2 month')
            END
        WHERE phone_number IN ('N01','N02');
        
        */
    },
    syncTransactionByAccountNumber: async (accountNumber) => {
        //Tiến hành gọi hàm đồng bộ qua casso
        const res = await cassoService.syncTransaction(accountNumber);
        return res;
    },

    // 2 hàm dưới chưa cần quan tâm
    getTransactions: async () => {
        const res = await cassoService.getTransactions({params: "page=1"});
        return res;
    },
    registerWebhook: async() => {
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