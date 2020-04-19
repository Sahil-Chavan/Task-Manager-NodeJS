const express = require('express')
const Task = require('../models/task')
const authorization = require('../middleware/authorization')
router = new express.Router()

///////////////////////////Creat Tasks Endpoints///////////////////////////

router.post('/task',authorization, async(req,res)=>{
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    
    try {
        await task.save()
        res.status(201).send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

///////////////////////////Find Tasks Endpoints///////////////////////////

router.get('/task',async(req,res)=>{
    
    try {
        result = await Task.find(req.query) 
        if(!result){ res.status(404).send()}
        res.send(result)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/task/:id',async(req,res)=>{
    _id = req.params.id
    try {
        result = await Task.findById(_id)
        if(!result){ res.status(404).send()}
        res.send(result)
    } catch (error) {
        res.status(500).send()
    }
})
///////////////////////////Update Tasks Endpoints///////////////////////////

router.patch('/task/:id',async (req,res)=>{
    ipkey = Object.keys(req.body)
    present_keys = ['des','status']
    is_valid = ipkey.every((x)=> present_keys.includes(x))

    
    try {
        result = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!result){res.status(404).send('Task not found')}
        if(!is_valid){ return res.status(400).send('keys not matching')}
        res.send(result)
    } catch (e) {
        res.status(500).send(e)
    }
})

///////////////////////////Delete User Endpoints///////////////////////////

router.delete('/task/:id',async(req,res)=>{

    try {
        task = await Task.findByIdAndDelete(req.params.id)
        if(!task){ return res.status(404).send('task not found')}
        res.send(task)
    } catch (e) {
        res.status(500).send(e) 
    }
})

module.exports = router