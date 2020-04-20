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

router.get('/task',authorization,async(req,res)=>{
    
    try {
        result = await Task.find({
            ...req.query,
            owner:req.user._id
        }) 
       
        if(!result){ res.status(404).send()}
        res.send(result)
    } catch (error) {
        res.status(500).send()  
    }
})

router.get('/task/populate',authorization,async(req,res)=>{
    try {
    //    if(req.query.status){
    //        req.query.status = req.query.status === 'true'
    //    }
    // console.log(req.query)
       await req.user.populate({
            path:'tasks',
            match:{
                ...req.query.des&&{des:req.query.des},
                ...req.query.status&&{status:req.query.status==='true'},
                ...req.query.id&&{_id:req.query.id},
            },
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }

        }).execPopulate()
        console.log
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/task/:id',authorization,async(req,res)=>{
    _id = req.params.id
    try {
        // result = await Task.findById(_id)
        result = await Task.findOne({_id, owner:req.user._id})
        if(!result){ res.status(404).send()}
        res.send(result)
    } catch (error) {
        res.status(500).send()
    }
})
///////////////////////////Update Tasks Endpoints///////////////////////////

router.patch('/task/:id',authorization,async (req,res)=>{
    ipkey = Object.keys(req.body)
    present_keys = ['des','status']
    is_valid = ipkey.every((x)=> present_keys.includes(x))
    _id = req.params.id
    
    try {
        result = await Task.findOneAndUpdate({ _id , owner:req.user._id },req.body,{new:true,runValidators:true})
        if(!result){res.status(404).send('Task not found')}
        if(!is_valid){ return res.status(400).send('keys not matching')}
        res.send(result)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

///////////////////////////Delete User Endpoints///////////////////////////

router.delete('/task/:id',authorization,async(req,res)=>{
    _id = req.params.id
    try {
        task = await Task.findOneAndDelete({ _id , owner:req.user._id })
        if(!task){ return res.status(404).send('task not found')}
        res.send(task)
    } catch (e) {
        res.status(500).send(e.message) 
    }
})

module.exports = router