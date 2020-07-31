const express = require('express');
const Controller = require('./controller');
const Middleware = require('../../Functions/Middlewares');

const router = express.Router();

router.post('/', Middleware.adminAuthentication, Controller.Create);
router.get('/', Middleware.authenticateToken, Controller.List);
router.get('/list', Middleware.authenticateToken, Controller.distict);

module.exports = router;