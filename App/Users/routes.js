const express = require('express');
const Controller = require('./controller');
const Middleware = require('../../Functions/Middlewares');

const router = express.Router();

router.post('/', Controller.Create);
router.post('/login', Controller.Login);
router.get('/', Middleware.adminAuthentication, Controller.List);

module.exports = router;