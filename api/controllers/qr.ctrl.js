const cryptoRandomString = require('crypto-random-string');
const axios = require('axios');

exports.qrController = {
    scanQR(req, res) {
        res.send("Scanned Successfully!");
    },
    createQR(req, res) {
        const randomString = cryptoRandomString({length: 30, type: 'alphanumeric'});
        const service_url = "http://localhost:3000/api/qr/";
        const qr_secretkey = `${service_url}${randomString}`;
        
        const qr_url = `https://api.qrserver.com/v1/create-qr-code/?size=700x700&data=${qr_secretkey}`;
        axios.get(qr_url, {responseType: 'arraybuffer'})
          .then(response => {
            res.status(200).json({
                secretkey: qr_secretkey,
                url: Buffer.from(response.data, 'binary').toString('base64')
            })
        }).catch(error => {
            res.status(500).json({
                status: false,
                message: error
            })
        });
    }  
}