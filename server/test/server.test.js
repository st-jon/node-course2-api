const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {ObjectID} = require('mongodb')


const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done())
})

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'test todo text'

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if(err) {
                    return done(err)
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((e) => done(e))
            })
    })

    it('Should not create todo with invalid bosy datas', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err)
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e) => done(e))
            })
    })
})

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})

describe('GET /todos/:id', () => {
    it('Should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('Second test todo')
            })
            .end(done)
    })

    it('Should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    })

    it('Should return 404 if the ID is not valid', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(400)
            .end(done)
    })
})

// describe('DELETE /todos/:id', () => {
//     it('Should delete todo doc', (done) => {
//         request(app)
//             .delete(`/todos/${todos[1]._id.toHexString()}`)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.todo.text).toBe('Second test todo')
//             })
//             .end(done)
//     })

//     it('Should return 404 if todo not found', (done) => {
//         request(app)
//             .delete(`/todos/${new ObjectID().toHexString()}`)
//             .expect(404)
//             .end(done)
//     })

//     it('Should return 404 if the ID is not valid', (done) => {
//         request(app)
//             .delete(`/todos/123`)
//             .expect(400)
//             .end(done)
//     })
// })