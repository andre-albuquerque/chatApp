require('express-async-errors');
const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();

const jsonParser = bodyParser.json()

const roomController = require('../controllers/roomController')

router.get('/rooms', roomController.getRooms)

router.post('/createRoom', jsonParser, roomController.addRoom)

router.delete('/deleteRoom', jsonParser, roomController.deleteRoom)

router.patch('/updateRoom', jsonParser, roomController.updateRoom)

module.exports = router;