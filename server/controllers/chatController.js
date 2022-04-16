const mongoose = require('mongoose');
require('../models/Chat');
const Chat = mongoose.model('chat');

const date = new Date()

module.exports = {
    async saveChat (req, res) {
        let chat = new Chat({
            message: req.body.message,
            name: req.body.name,
            group: req.body.group,
        })
        try {
            chat.save().then(res.status(201).json({message: 'Mensagens salvas com sucesso!'}))
            
        } catch (error) {
            res.status(500).json({erro: error})
        }
    },

    async getChat (req, res) {
        try {
            const chatMessages = await Chat.find({group: req.body.group})
            if (!chatMessages){
                res.status(409).json({message: 'Mensagens não encontradas.'})
            }
            res.status(201).json({chatMessages: chatMessages})

        } catch (error) {
            res.status(500).json({error: error})
        }
    }
}