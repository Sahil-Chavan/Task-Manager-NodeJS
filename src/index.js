import './db/mongoose'
import express, { json } from 'express'
const app = express()
const port = process.env.PORT
import userRouter from './routers/user'
import taskRouter from './routers/task'
app.use(json())
app.use(userRouter)
app.use(taskRouter)



/////////////////////////// Port Listen ///////////////////////////
app.listen(port,()=>{
    console.log('server is up on '+ port);
})