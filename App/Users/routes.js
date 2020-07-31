const express = require('express');
const Controller = require('./controller');

const router = express.Router();

router.post('/', Controller.Create);
router.post('/login', Controller.Login);
router.get('/', Controller.List);

module.exports = router;