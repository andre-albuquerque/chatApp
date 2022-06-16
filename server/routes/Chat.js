require('express-async-errors');
const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
const checkAuth = require('../middleware/login')


const jsonParser = bodyParser.json();

const chatController = require('../controllers/chatController');

router.post('/saveChat', jsonParser, checkAuth, chatController.saveChat);

router.post('/getChat', jsonParser, checkAuth, chatController.getChat);

router.post('/getRecentChat', jsonParser, checkAuth, chatController.getRecentChat)

module.exports = router;