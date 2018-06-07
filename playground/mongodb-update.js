//const MongoClient = require('mongodb').MongoClient
const{ MongoClient, ObjectID } = require('mongodb')


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    // findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     _id : new ObjectID('5b194d7ae3d2dc2c33ccb25a')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then(((result) => {
    //     console.log(result)
    // }))

    db.collection('Users').findOneAndUpdate({
        _id : new ObjectID('5b19474fe3d2dc2c33ccb24e')
    }, {
        $set: {
            name: 'Caro'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then(((result) => {
        console.log(result)
    }))

    //client.close()
})