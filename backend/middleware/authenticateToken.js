import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/user.js'

dotenv.config()


const authenticateToken = (req, res, next) => {
  console.log('authenticateToken')
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {console.log(err)
        return res.sendStatus(403)}
      req.user = await User.findOne({email: user.email})
      console.log(req.user)
      next()
    })
  }

  export default authenticateToken
