const express = require('express')
const User = require('../models/user')
const authorization = require('../middleware/authorization')
router = new express.Router()




/////////////////////////// Creat Users Endpoints///////////////////////////

router.post('/user', async(req,res)=>{
    const user = new User(req.body)
    
    try {
        await user.genToken()
        await user.save()
        res.send(user)
        
    } catch (err) {
        res.status(400).send(err.message)
        
    }
 
})

/////////////////////////// Users Login Endpoints///////////////////////////

router.post('/user/login',async (req,res)=>{
    data ={
        email:req.body.email,
        pass:req.body.pass
    }
    try {
        user = await User.authentication(data)
        token = await user.genToken()
        res.send({user,token,msg:'Logged Inn'})
    } catch (e) {
        res.status(404).send(e.message)
    }
})

///////////////////////////Find Users Endpoints///////////////////////////



router.get('/user',authorization, async (req,res)=>{
    
    try {
    result = await User.find(req.query)
    if(!result){return res.status(401).send()}
    res.send(result)
        
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/user/:id',authorization, async (req,res)=>{
     _id= req.params.id
     try {
        result = await User.findById(_id)
         if(!result){ return res.status(404).send() }
         res.send(result)
     } catch (error) {
         res.status(500).send()
     }
})

///////////////////////////Update User Endpoints///////////////////////////
router.patch('/user/:id',authorization, async (req,res)=>{
    ipkey = Object.keys(req.body)
    present_keys = ['name','age','email','pass']
    is_valid = ipkey.every((x)=> present_keys.includes(x))

    
    try {
        result = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!result){res.status(404).send('User not found')}
        if(!is_valid){ return res.status(400).send('keys not matching')}
        res.send(result)
    } catch (e) {
        res.status(500).send(e)
    }
})

///////////////////////////Delete User Endpoints///////////////////////////

router.delete('/user/:id',authorization, async(req,res)=>{

    try {
        user = await User.findByIdAndDelete(req.params.id)
        if(!user){ return res.status(404).send('user not found')}
        res.send(user)
    } catch (e) {
        res.status(500).send(e) 
    }
})

module.exports = router