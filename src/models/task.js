const mongoose = require('mongoose')
const vali = require('validator')
const taskSchema = new mongoose.Schema({

    des:{type:String,trim:true,required:true},
        status:{type:Boolean,default:false},
        owner:{type: mongoose.Schema.Types.ObjectId,required:true,ref:'User'}

},{
    timestamps:true  
})

const Task = mongoose.model('Task',taskSchema)
    
    // const t1 = new Task(
        //     {
            //         des:'milk',
            //     })
            
            //     t1.save().then(()=>{console.log(t1)}).catch((er)=>{console.log(er)})

            module.exports = Task