let express = require('express')
let bodyParser = require('body-parser')


let {mongoose} = require('./db/mongoose')
let {Todo} = require('./models/todo')
let {User} = require('./models/user')
const {ObjectID} = require('mongodb')

let app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    })

    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos/:id', (req, res) => {
    let id = req.params.id
    if (!ObjectID.isValid(id)) {
        return res.status(404)
        .send(console.log('ID is not valid'))
    }

    Todo.findById(id).then((todo) => {
       !todo ? res.status(404).send() : res.send({todo})
    }).catch((e) => res.status(404).send())
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})


module.exports = {
    app
}