const cryptoRandomString = require('crypto-random-string');
const axios = require('axios');

const User = require('../models/user.model')
const Group = require('../models/group.model');

//const site_url = "https://qr-go.netlify.app";
const site_url = "http://localhost:3001";

const Event = require('../utils/events').eventBus;

exports.qrController = {
    async scanQR(req, res) {
        let flag = false;
        if(req.user)
        {
            try {
                const _id = req.user._id;
                let user = await User.findById({ _id }).populate({ path: 'group', populate: { path: 'game' , populate: { path: 'route' }}});
                if(user.group)
                {
                    if(user.group.game.state === 'Ingame')
                    {
                        const userGame = user.group.game;
                        const userGroup = user.group;
                        let currentChallenge = userGroup.currentChallenge;
                        const challenge = userGame.route.challenges[currentChallenge - 1]

                        const secretkey = challenge.qrData.substring(challenge.qrData.lastIndexOf('/') + 1);

                        if(secretkey === req.params.secretkey)
                        {
                            const challengesTime = userGroup.challengesTime;

                            // Add time of challenge
                            const date = new Date();
                            challengesTime.push(date);

                            // Update current challenge
                            currentChallenge++;

                            Group.updateOne({ _id: userGroup._id },
                                { $set: { 'currentChallenge' : currentChallenge, 'challengesTime' : challengesTime }})
                                .then(() => {
                
                            }).catch(error => {
                                console.log(error);
                            });

                            // send notfication 
                            Event.emit('scan', userGroup._id);
                            flag = true;
                        } 
                    }

                } 

            } catch(e) {
                res.redirect(`${site_url}/failed-scan`);
            }   
        }

        if(flag)
         res.redirect(`${site_url}/successful-scan`);
        else res.redirect(`${site_url}/failed-scan`);
    },
    createQR(req, res) {
        const randomString = cryptoRandomString({length: 30, type: 'alphanumeric'});
        const service_url = "https://qr-go.herokuapp.com/api/qr/";
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