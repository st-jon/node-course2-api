//const MongoClient = require('mongodb').MongoClient
const{ MongoClient, ObjectID } = require('mongodb')


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    // deleteMany
    db.collection('Users').deleteMany({name: 'chris'}).then((result) => {
        console.log(result)
    })
    // deleteOne
    // db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
    //     console.log(result)
    // })
    // findOneAndDelete
    db.collection('Users').findOneAndDelete({
            _id: new ObjectID('5b194f82e3d2dc2c33ccb269')
            }).then((result) => {
        console.log(result)
    })




    //client.close()
})