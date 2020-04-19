require('./db/mongoose')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



/////////////////////////// Port Listen ///////////////////////////
app.listen(port,()=>{
    console.log('server is up on '+ port);
})