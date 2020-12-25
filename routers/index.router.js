const { Router } = require ('express');
const { ensureAuth, ensureGuest } = require('../middlewares/auth')
const indexRouter = new Router();

indexRouter.get('/', ensureGuest, (req, res) => {
    res.sendFile(path.join(__dirname + '/client/index.html'));
})

module.exports =  indexRouter ;