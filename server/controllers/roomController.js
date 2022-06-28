const mongoose = require('mongoose');
require('../models/Room');
const Room = mongoose.model('room');
const Chat = mongoose.model('chat');


module.exports = {
    async addRoom (req, res){
        try {
            const room = await Room.findOne({room: req.body.room})
            if (room) {
                return res.status(409).json({message:'Já existe um grupo cadastrado com esse nome.'});   
                            
            }else{
                const newRoom = new Room({room: req.body.room})
                newRoom.save().then(()=>{
                    return res.status(201).json({message:'Grupo cadastrado com sucesso!'})
                })
            }

        } catch (error) {
            return res.status(500).json({message: 'Houve um erro interno.'})
        }        
    },

    async getRooms (req, res) {
        try {
            const rooms = await Room.find();
            if (!rooms) {
                res.status(409).json({message:'Nenhum grupo cadastrado.'}); 
            }
            res.status(201).json({rooms: rooms})
            
        } catch (error) {
            res.status(500).json({erro: error})
        }
    },

    async deleteRoom (req, res, next) {
        try {
            const room = await Room.findOne({room: req.body.room});
            console.debug({"room": req.body.room})
            if (!room){
                return res.status(409).json({message:'Grupo não encontrado.'});     
            }
            Promise.all([
                Chat.deleteMany({ group: req.body.room }),
                Room.deleteOne({ room: req.body.room })                                 
            ]).then(()=>{
                return res.status(201).json({message: 'Grupo excluído com sucesso!'});
            })

         
        } catch (error) {
            return res.status(500).json({erro: error})
        }
    },

    async updateRoom (req, res) {
        try {
            const room = await Room.findOne({room: req.body.prevRoom});
            console.debug({"prevRoom": req.body.prevRoom})
            console.debug({"room": req.body.room})
            if (!room){
                return res.status(409).json({message: 'Grupo não encontrado.'})
            }
            const filter = {room: req.body.prevRoom}
            const update = {room: req.body.room}
            const updateRoom = await Room.updateOne(filter, update)
            if (updateRoom) {
                return res.status(201).json({message: 'Grupo atualizado com sucesso!'})
            }
        } catch (error) {
            return res.status(500).json({erro: error})
        }
    }
}
