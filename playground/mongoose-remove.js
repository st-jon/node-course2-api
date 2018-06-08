const {ObjectID} = require('mongodb')

const{mongoose} = require('./../server/db/mongoose')
const{Todo} = require('./../server/models/todo')
const{User} = require('./../server/models/user')

// Todo.remove()

// Todo.remove({}).then((result) => {
//     console.log(result)
// })

// Todo.findOneAndRemove()

// Todo.findByIdAndRemove()

Todo.findByIdAndRemove('5b1a5d2f5b3667335b15bf24').then((todo) => {
    console.log(todo)
})  