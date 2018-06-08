const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

let userSchema = new  mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE}, is not a valid email'
        }
    }, password:   {
        type: 'string',
        require: true,
        minlength: 6
    }, tokens: [{
        access: {
            type: 'string',
            require: true
        },
        token: {
            type: 'string',
            require: true
        }
    }] 
})

userSchema.methods.toJSON = function () {
    let user = this
    let userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email'])
}

userSchema.methods.generateAuthToken = function () {
    let user = this
    let access = 'auth'
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString()

    user.tokens = user.tokens.concat([{access, token}])

    return user.save().then(() => {
        return token
    })
}

let User = mongoose.model('User', userSchema)

module.exports = {
    User
}