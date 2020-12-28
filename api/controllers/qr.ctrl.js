const cryptoRandomString = require('crypto-random-string');
 
exports.qrController = {
    
    getQR(req, res) {
        res.send("ok");
    },
    createQR(req, res) {
        const randomString = cryptoRandomString({length: 30, type: 'alphanumeric'});
        const service_url = "http://localhost:3000/api/qr/";
        const qrURL = `${service_url}${randomString}`;
        res.send(qrURL);
    }  
}