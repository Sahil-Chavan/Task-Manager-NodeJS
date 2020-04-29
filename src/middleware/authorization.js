const jwt  = require('jsonwebtoken')
const User = require('../models/user')

const authorization = async (req,res,next) =>{
try {
      const token = req.header('Authorization').replace('Bearer ','')
      const decode = jwt.verify(token,process.env.JWT_SECRET)
      const user = await User.findOne({_id:decode._id,'tokens.token':token})
      if(!user){
          throw new Error('Authorization failed')
      }
      req.user = user
      req.token = token
      
      next()

} catch (e) {
    res.status(401).send(e.message)
}
}

module.exports = authorization