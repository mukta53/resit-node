const express = require('express');
const Controller = require('./controller');

const router = express.Router();

router.post('/',Controller.Create);
router.get('/', Controller.List);
router.get('/list', Controller.distict);

module.exports = router;