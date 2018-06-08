const {ObjectID} = require('mongodb')

const{mongoose} = require('./../server/db/mongoose')
const{Todo} = require('./../server/models/todo')
const{User} = require('./../server/models/user')

let id = '5b1a4689e804573127882a1c'

console.log(!ObjectID.isValid(id) ? 'ID is not valid' : '')

// .find()

// Todo.find({
//     _id: id
// }).then((todos) => {
// console.log('Todos', todos)
// })


// findOne()

// Todo.findOne({
//     _id: id
// }).then((todo) => {
// console.log('Todo', todo)
// })

// findById()

// Todo.findById(id).then((todo) => {
//     if(!todo) {
//         return console.log('Id not found')
//     }
//     console.log('Todo by Id', todo)
// }).catch((e) => console.log(e))


User.findById('5b1961ff604bcc2dd8e07755').then((user) => {
    if(!user) {
        return console.log('ID of this user not found')
    }
    console.log('User by ID : ', user.email)
}).catch((e) => console.log(e))