const cassoRestClient = require('../restClients/CassoRestClient');
const accessToken = process.env.API_KEY;
module.exports = {
    getDetailUser: async () => {
        cassoRestClient.defaults.headers.Authorization = accessToken;
        let res = await cassoRestClient.get(`/userInfo`);
        return res;
    },
    getTransactions: async (params) => {
        cassoRestClient.defaults.headers.Authorization = accessToken;
        let res = await cassoRestClient.get('/transactions', { params });
        return res;
    },
    getDetailTransaction: async (transactionId) => {
        cassoRestClient.defaults.headers.Authorization = accessToken;
        let res = await cassoRestClient.get(`/transactions/${transactionId}`);
        return res;
    },
    syncTransaction: async (bankNumber) => {
        cassoRestClient.defaults.headers.Authorization = accessToken;
        let res = await cassoRestClient.post('/sync', { bank_acc_id: bankNumber });
        return res;
    },
    getTokenByAPIKey: async (code) => {
        let token = await cassoRestClient.post('/token', { code: code });
        return token;
    },
    createWebhook: async (data) => {
        cassoRestClient.defaults.headers.Authorization = accessToken;
        let res = await cassoRestClient.post('/webhooks', data);
        return res;
    },
    getDetailWebhookById: async (webhookId) => {
        cassoRestClient.defaults.headers.Authorization = accessToken;
        let res = await cassoRestClient.get(`/webhooks/${webhookId}`);
        return res;
    },
    updateWebhookById: async (webhookId, data) => {
        cassoRestClient.defaults.headers.Authorization = accessToken;
        let res = await cassoRestClient.put(`/webhooks/${webhookId}`, data);
        return res;
    },
    deleteWebhookById: async (webhookId) => {
        cassoRestClient.defaults.headers.Authorization = accessToken;
        let res = await cassoRestClient.delete(`/webhooks/${webhookId}`);
        return res;
    },
    deleteWebhookByUrl: async (urlWebhook) => {
        // Thêm url vào query để delete 
        //https://oauth.casso.vn/v1/webhooks?webhook=https://website-cua-ban.com/api/webhook
        let query = { params: { webhook: urlWebhook } };
        cassoRestClient.defaults.headers.Authorization = accessToken;
        var res = await cassoRestClient.delete(`/webhooks`, query);
        return res;
    },
}
