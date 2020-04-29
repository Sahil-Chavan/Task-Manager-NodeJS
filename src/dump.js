require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
    

Task.findByIdAndDelete('5e94a0331928b7abd8dd9d99') .then((result) => {
    console.log(result)
    return Task.countDocuments({status:'false'})
}).then((res)=>{
    console.log(res);
}).catch((err) => {
});

const asyncfn = async (_id,status) =>{
    deldoc = await Task.findByIdAndDelete(_id)
    count = await Task.countDocuments({ status })
    return { deldoc , count }
}

asyncfn('5e94a0cd0335510d0c93acbe','false') .then((result) => {
        console.log(result.deldoc,result.count);
          
}).catch((err) => {
    console.log(err);
    
});

/////////////////////////// Creat Users Endpoints///////////////////////////

app.post('/user',(req,res)=>{
    const user = new User(req.body)
    
    user.save().then(() => {
        res.send(user)
    }).catch((err) => {
        res.status(400).send(err)
    });
})
///////////////////////////Find Tasks Endpoints///////////////////////////


// app.get('/user',(req,res)=>{
//     User.find({}) .then((result) => {
//         res.send(result)
//     }).catch((err) => {
//         res.status(400).send(err)
//     });
// })

app.get('/user',(req,res)=>{
    
    User.find(req.query).then((result) => {
        if(!result){return res.status(401).send(err)}
        res.send(result)
    }).catch((err) => {
        res.status(400).send(err)
    });
})

app.get('/user/:id',(req,res)=>{
     _id= req.params.id
    User.findById(_id).then((result) => {
        if(!result){ return res.status(404).send() }
        res.send(result)
    }).catch((e) => {
        console.log(e);
        
        res.status(500).send()
    });
})



///////////////////////////Creat Tasks Endpoints///////////////////////////

app.post('/task',(req,res)=>{
    const task = new Task(req.body)
    
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((err) => {
        res.status(400).send(err)
    });
})

///////////////////////////Find Tasks Endpoints///////////////////////////

app.get('/task',(req,res)=>{
    Task.find(req.query) .then((result) => {
        if(!result){ res.status(404).send()}
        res.send(result)
    }).catch((err) => {
        res.status(500).send()
    });
})

app.get('/task/:id',(req,res)=>{
    _id = req.params.id
    Task.findById(_id) .then((result) => {
        if(!result){ res.status(404).send()}
        res.send(result)
    }).catch((err) => {
        res.status(500).send()
    });
})

////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/user/logoutAll',authorization, async (req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send("Logged out of all tokens")
    } catch (error) {
        res.status(500).send("error")
    }
})
 
