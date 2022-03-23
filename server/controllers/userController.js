const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('user');
const bcrypt = require('bcryptjs');
const formValidation = require('./formValidation')


module.exports = {
    async signup (req,res,next){
        
        validation = new formValidation(req.body.email, req.body.username, req.body.password, req.body.passwordCheck);        
        
        obj = validation.validation()

        const isEmpty = Object.keys(obj).length === 0

        if (!isEmpty){
            res.status(409).json(obj)   
            return;         
        }          
        
        try {
            const email = await User.findOne({email: req.body.email})
            const user = await User.findOne({username: req.body.username})
            if (email) {
                res.status(409).json({message:'Já existe uma conta cadastrada com esse email.'}); 
                
            }            
            else if (user) {
                res.status(409).json({message:'Username indisponível, tente outro.'})
            
            }else{
                const newUser = new User({
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password
                })
            
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if (err) {
                            res.status(500).json({message: 'Houve um erro durante o salvamento.'})
    
                        }else{
                            newUser.password = hash
                            newUser.save().then(()=>{
                                res.status(201).json({message:'Usuário cadastrado com sucesso!'})
                            })
                        }
                    })
                })
            }    
        } catch (error) {
            res.sendStatus(500).json({message: 'Houve um erro interno.'})
        } 
    }
};