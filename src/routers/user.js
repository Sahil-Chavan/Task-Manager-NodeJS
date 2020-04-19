const express = require('express')
const User = require('../models/user')
const authorization = require('../middleware/authorization')
router = new express.Router()




/////////////////////////// Creat Users Endpoints///////////////////////////



router.post('/user/signup', async(req,res)=>{
    const user = new User(req.body)
    
    try {
       token = await user.genToken()
        await user.save()
        res.status(201).send({user, token})
        
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
        res.send({user,token})
    } catch (e) {
        res.status(404).send(e.message)
    }
})

/////////////////////////// Users Profile Endpoints///////////////////////////

router.get('/user/profile',authorization, async (req,res)=>{
    
    try {
    
    res.send(req.user)
        
    } catch (err) {
        res.status(400).send(err)
    }
})

///////////////////////////Update Profile Endpoints///////////////////////////
router.patch('/user/profile',authorization, async (req,res)=>{
    ipkey = Object.keys(req.body)
    present_keys = ['name','age','email','pass']
    is_valid = ipkey.every((x)=> present_keys.includes(x))

    
    try {
        up_doc = await req.user.updateOne(req.body,{runValidators:true}).lean()
        // result = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        // if(!up_doc){res.status(404).send('User not found')}
        if(!is_valid){ return res.status(400).send('keys not matching')}
        updated_doc = await User.findOne({_id:req.user._id})
        res.send([req.user,updated_doc])
    } catch (e) {
        res.status(500).send(e)
    }
})

///////////////////////////Self Delete User Endpoints///////////////////////////
router.delete('/user/profile',authorization,async (req,res)=>{
    try {
       await req.user.remove()
       res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

///////////////////////////logout User Endpoints///////////////////////////
router.post('/user/logout',authorization, async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send("logged out")
    } catch (e) {
        res.send(500).send(e.message)
    }
})

router.post('/user/logoutAll',authorization, async (req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send("Logged out of all tokens")
    } catch (error) {
        res.status(500).send("error")
    }
})



//+++++++++++++++++++++++++++++++++++++++++++++++++++++ ALL THE REQUSETS WHICH SHOULD NOT BE PRESENT +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 


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

/////////////////////////// Finding Users Endpoints///////////////////////////
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



module.exports = router