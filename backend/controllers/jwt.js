import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const secret = process.env.JWT_SECRET

export const createToken = (user) => {
    return jwt.sign({ email: user.email }, secret, { expiresIn: '120m' })
}

export const verifyToken = (token) => {
    return jwt.verify(token, secret)
}
