import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    displayName: String,
    picture: String,
    shortBio: String,
    longBio: String,
    role: String,
    displayEmail: String,
    website: String,
    lastLogin: Date,
    lastEdit: Date,
    registeredIp: String,
    lastIp: String,
    posts: Array,
    comments: Array,
    verifiedEmail: Boolean,
    emailVerifyToken: String,
})

userSchema.methods.encryptPassword = function( pwd ) {
    return bcrypt.hashSync(pwd, bcrypt.genSaltSync(10), null)
}

userSchema.methods.validPassword = function( pwd ) {
    return bcrypt.compareSync(pwd, this.password)
}

userSchema.methods.generateEmailVerifyToken = function() {
    let token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    this.emailVerifyToken = token
    return token
}

userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.password = this.encryptPassword(this.password)
    }
    next()
})

const User = mongoose.model("User", userSchema)


export default User