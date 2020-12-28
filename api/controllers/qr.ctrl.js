const cryptoRandomString = require('crypto-random-string');
const axios = require('axios');

exports.qrController = {
    getQR(req, res) {
        res.send("ok");
    },
    createQR(req, res) {
        const randomString = cryptoRandomString({length: 30, type: 'alphanumeric'});
        const service_url = "http://localhost:3000/api/qr/";
        const qr_data = `${service_url}${randomString}`;
        
        const qr_url = `https://api.qrserver.com/v1/create-qr-code/?size=650x650&data=${qr_data}`;
        axios.get(qr_url, {responseType: 'arraybuffer'})
          .then(response => {
            res.status(200).json({
                qrdata: qr_data,
                qrurl: Buffer.from(response.data, 'binary').toString('base64')
            })
        }).catch(error => {
            res.status(500).json({
                status: false,
                message: error
            })
        });
    }  
}


