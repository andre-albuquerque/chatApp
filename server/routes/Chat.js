require('express-async-errors');
const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();

const jsonParser = bodyParser.json();

const chatController = require('../controllers/chatController');

router.post('/saveChat', jsonParser, chatController.saveChat);

router.post('/getChat', jsonParser, chatController.getChat);

module.exports = router;