const NodeHelper = require('node_helper');
const request = require('request');

const d = new Date();
const n = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
// console.log(`MMM-YrThen ${n}: Starting MMM-YrThen in node_helper`);

module.exports = NodeHelper.create({
    start: function() {
        const d = new Date();
        const n = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
        console.log(`MMM-YrThen ${n}: Starting helper for MMM-YrThen`);
        this.config = null;
        this.forecastUrl = '';
    },

    socketNotificationReceived: function(notification, payload) {
        const self = this;
        const d = new Date();
        const n = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
//        console.log(`MMM-YrThen ${n}: Received notification`);
        if (notification === 'GET_YRTHEN_FORECAST') {
            const d = new Date();
            const n = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
//            console.log(`MMM-YrThen ${n}: Received GET_YRTHEN_FORECAST notification`);
            self.config = payload.config;
            self.forecastUrl = payload.forecastUrl;
            this.getForecastFromYrThen();
        }
    },

    getForecastFromYrThen: async function() {
        const d = new Date();
        const n = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
//        console.log(`MMM-YrThen ${n}: Getting forecast`);
        const self = this;
        const locationData = {};

        try {
            const response = await this.makeRequest(self.forecastUrl);
            if (response.statusCode === 200 || response.statusCode === 304) {
                locationData.forecast = JSON.parse(response.body);
                const d = new Date();
                const n = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
//                console.log(`MMM-YrThen ${n}: Returning forecast`);
                self.sendSocketNotification('YRTHEN_FORECAST_DATA', locationData);
            } else {
                const d = new Date();
                const n = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
//                console.log(`MMM-YrThen ${n}: Error!`);
                throw new Error(`Error fetching forecast: ${response.statusCode}`);
            }
        } catch (error) {
            console.error('Error fetching forecast:', error);
        }
    },

    makeRequest: function(url) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({ statusCode: response.statusCode, body: body });
                }
            });
        });
    }
});
