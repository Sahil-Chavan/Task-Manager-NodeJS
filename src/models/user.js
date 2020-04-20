const mongoose = require('mongoose')
const vali = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new mongoose.Schema({

    name:{type:String,required:true,trim:true,lowercase:true},
    age:{type:Number,default:0,validate(value){if(value<0){throw new Error('Age must be positive')}}},
    email:{type:String,required:true,trim:true,validate(val){if(!vali.isEmail(val)){throw new Error('Enter correct Email')}},unique:true},
    pass:{type:String,required:true,trim:true,minlength:7,
        validate(value){if(value.length<7){throw new Error('Password should have at least 7 digits')}
                        if(value.toLowerCase().includes("password")){throw new Error('Password should not contain password')}                    
                        }
        },
    tokens:[{
        token:{type:String,required:true}
    }]

},{
    timestamps:true
})


userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function (){
        dataObj = this.toObject()
        delete dataObj.pass
        delete dataObj.tokens
        return dataObj
}

userSchema.methods.genToken = async function () {
    token = jwt.sign({_id: this._id.toString()},'nodejs')
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}

userSchema.statics.authentication = async ({email,pass}) =>{
    user = await User.findOne({email})
    if(!user){
        throw new Error('User not found')
    }
    isMatch = await bcrypt.compare(pass,user.pass)
    if(!isMatch){

        throw new Error('Credentials do not match')
    }
    return user
}


userSchema.pre('save',async function(next){
    if(this.isModified('pass')){
        console.log(this.pass)
        this.pass = await bcrypt.hash(this.pass, 8)
        console.log(this.pass)
    }   
    next()
})
userSchema.pre('updateOne',{ document: true, query: false },async function(next){
    // console.log("just before updating");
    const docup = await this.model.findOne(this.getQuery())
    // if(docup.isModified('pass')){
    //     console.log('found it in fn')
    // }
    update_doc = this.getUpdate()

    if(update_doc.pass){
        console.log('found it')
        console.log(update_doc.pass)
        update_doc.pass = await bcrypt.hash(update_doc.pass, 8)
        console.log(update_doc.pass)
    } 
    // console.log(this.getQuery())
    // console.log(this.getUpdate())

    next()
})

userSchema.pre('remove', async function(next){

    await Task.deleteMany({owner:this._id})
    
    next()
})

const User = mongoose.model('User',userSchema)




// const Task = mongoose.model('Task',{
    //     des:{type:String,trim:true,required:true},
    //     status:{type:Boolean,default:false}
    // })
    
    // const t1 = new Task(
        //     {
            //         des:'milk',
            //     })
            
            //     t1.save().then(()=>{console.log(t1)}).catch((er)=>{console.log(er)})
            module.exports = User