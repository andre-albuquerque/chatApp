const mongoose = require('mongoose');
require('../models/Chat');
const Chat = mongoose.model('chat');


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
           
            let group = req.query.group
        
            const chatMessages = await Chat.find({group: group})

            if (!chatMessages || (chatMessages.length === 0)) {
                res.status(404).json({message: 'Mensagens não encontradas.'})
            }else{
                res.status(200).json({chatMessages: chatMessages})
            }         

        } catch (error) {
            res.status(500).json({error: error})
        }
    },

    async getRecentChat (req, res) {

        try {

            let group = req.query.group

            const chatMessages = await Chat.aggregate([
                {
                '$match': {
                    'group': group
                }
                }, {
                '$sort': {
                    'time': -1
                }
                }, {
                '$limit': 1
                }
            ])

            if (!chatMessages || (chatMessages.length === 0)) {
                res.status(404).json({message: 'Mensagens não encontradas.'})
            }else{                   
                res.status(200).json({chatMessages: chatMessages})
            }              
                   
  
        } catch (error) {
            res.status(500).json({error: error})
        }
    }
}