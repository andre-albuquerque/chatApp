const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('user');
const bcrypt = require('bcryptjs')



router.post('/register', async (req,res)=>{
    const user = await User.findOne({email: req.body.email})
    if (user) {
        req.flash('error_msg', 'Já existe uma conta cadastrada com esse email.')
    }else{
        const newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        })

        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(newUser.password, salt, (err, hash)=>{
                if (err) {
                    req.flash('error_msg', 'Houve um erro durante o salvamento.')
                    res.redirect('/')
                }else{
                    newUser.password = hash
                    newUser.save().then(()=>{
                        req.flash('success_msg', 'Usuário cadastrado com sucesso!')
                        res.redirect('/')
                    }).catch((err)=>{
                        req.flash('error_msg', 'Houve um erro ao cadastrar o usuário. Tente novamente.')
                        res.redirect('/')
                    })
                }
            })
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno.')
            res.redirect('/')
        })
    }
})

module.exports = router
