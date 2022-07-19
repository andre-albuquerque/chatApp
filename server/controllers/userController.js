const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
            res.status(500).json({message: 'Houve um erro interno.'})
        } 
    },
    

    async login (req, res, next) {
        try {
            const user = await User.findOne({email: req.body.email})
            
            if (!user) {                    
                return res.status(401).json({message: 'Falha na autenticação 1'})
            }

            bcrypt.compare(req.body.password, user.password, (err, success)=>{
                if (err) {
                    return res.status(401).json({message: 'Falha na autenticação 2'})
                }
                if (success) {
                    const token = jwt.sign({
                        id_user: user._id,
                        email: user.email,
                        admin: user.isAdmin
                    }, process.env.JWT_KEY, 
                    {expiresIn: "12h"}
                    ); 
         
                    res.cookie('token', token, {
                        expires:new Date(Date.now() + 9000000),
                        sameSite: 'none', secure: true, httpOnly: false
                    });

                    res.cookie('user', user.username, {                        
                        expires:new Date(Date.now() + 9000000),
                        sameSite: 'none', secure: true, httpOnly: false
                    })

                    if (user.isAdmin === true) {
                        res.cookie('admin', user.isAdmin, {                        
                            expires:new Date(Date.now() + 9000000),
                            sameSite: 'none', secure: true, httpOnly: false
                        })
                    }

                    return res.status(201).json({msg: 'Autenticado com sucesso!', 
                                                username: user.username,
                                                admin: user.isAdmin,
                                                message: user.message,
                                                token: token})
                }

                return res.status(401).json({message: 'Falha na autenticação 3'})                       
            })               

        } catch (error) {
            return res.status(500).json({error: error})
        }
    },

    logout (req,res) {
        res.end()
    }
};
