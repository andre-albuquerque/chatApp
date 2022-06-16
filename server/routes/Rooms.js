require('express-async-errors');
const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
const checkAuth = require('../middleware/login')
const isAdmin = require('../middleware/isAdmin')


const jsonParser = bodyParser.json()

const roomController = require('../controllers/roomController')

router.get('/rooms', checkAuth, roomController.getRooms)

router.post('/createRoom', jsonParser, checkAuth, isAdmin, roomController.addRoom)

router.delete('/deleteRoom', jsonParser, checkAuth, isAdmin, roomController.deleteRoom)

router.patch('/updateRoom', jsonParser, checkAuth, isAdmin, roomController.updateRoom)

module.exports = router;