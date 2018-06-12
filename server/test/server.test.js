const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {ObjectID} = require('mongodb')
const {User} = require('./../models/user')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'test todo text'

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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

    it('Should not create todo with invalid datas', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1)
            })
            .end(done)
    })
})

describe('GET /todos/:id', () => {
    it('Should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })

    it('Should not return todo doc created by other user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('Should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('Should return 404 if the ID is not valid', (done) => {
        request(app)
            .get(`/todos/123`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })
})

describe('DELETE /todos/:id', () => {
    it('Should remove todo', (done) => {
        let hexID = todos[1]._id.toHexString()
        request(app)
            .delete(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text)
            })
            .end((err, res) => {
                if(err) {
                    return done(err)
                }

                Todo.findById(hexID).then((todo) => {
                    expect(todo).toBeFalsy()
                    done()
                }).catch((e) => done(e))
            })
    })

        it('Should not remove todo from another user', (done) => {
            let hexID = todos[0]._id.toHexString()
            request(app)
                .delete(`/todos/${hexID}`)
                .set('x-auth', users[1].tokens[0].token)
                .expect(404)
                .end((err, res) => {
                    if(err) {
                        return done(err)
                    }
    
                    Todo.findById(hexID).then((todo) => {
                        expect(todo).toBeTruthy()
                        done()
                    }).catch((e) => done(e))
                })
        })

    it('Should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('Should return 404 if the ID is not valid', (done) => {
        request(app)
            .delete(`/todos/123`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done)
    })
})

describe('PATCH /todos/:id', () => {

    it('Should update the todo', (done) => {
        let hexID = todos[0]._id.toHexString()
        let text = 'this is the new text updated'

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({text, completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('this is the new text updated')
                expect(res.body.todo.completed).toBe(true)
                // expect(res.body.todo.completedAt).toBeA('number')
                expect(typeof res.body.todo.completedAt).toBe('number')
            })
            .end(done) 
    })

    it('Should not update the todo created by other users', (done) => {
        let hexID = todos[0]._id.toHexString()
        let text = 'this is the new text updated'

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({text, completed: true})
            .expect(404)
            .end(done) 
    })
    
    it('Should clear completedAt when todo is not completed', (done) => {
        let hexID = todos[1]._id.toHexString()
        let text = 'this the other updated text'

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({text, completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('this the other updated text')
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toBeFalsy()
            })
            .end(done)
    })
})

describe('GET /users/me', () => {
    it('Should return user if authentificated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })
    it('Should return 401 if not authentificated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
                .expect((res) => {
                    expect(res.body).toEqual({})
                })
                .end(done)
                
    })
})

describe('POST /users', () => {
    it('Should create a user', (done) => {
        let email = 'exemple@exemple.com'
        let password = '123mnb!'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy()
                expect(res.body._id).toBeTruthy()
                expect(res.body.email).toBe(email)
            })
            .end((err) => {
                if(err) {
                    return done(err)
                }
                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy()
                    expect(user.password).not.toBe(password)
                    done()
                }).catch((e) => done(e))
            })
    })

    it('Should return validation errors if request invalid', (done) => {
        let email = 'sjggdg'
        let password = 'a'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
    })

    it('Should not create user if email in use', (done) => {
        let email = users[0].email

        request(app)
            .post('/users')
            .send({email})
            .expect(400)
            .end(done)
    })
})

describe('POST /users/login', () => {
    it('Should login user and return auth token', (done) => {
       request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy()
        })
        .end((err, res) => {
            if (err) {
                return done(err)
            }
            User.findById(users[1]._id).then((user) => {
                expect(user.toObject().tokens[1]).toMatchObject({
                    access: 'auth',
                    token: res.headers['x-auth']
                })
                done()
            }).catch((e) => done(e))
        })
    })   

    it('Should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password +1
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy()
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1)
                    done()
                }).catch((e) => done(e))
            })
    })   
})

describe('DELETE /users/me/token', () => {
    it('Should remove auth token on logout', (done) => {
        request(app)
         .delete('/users/me/token')
         .set('x-auth', users[0].tokens[0].token)
         .expect(200)
         .expect((res) => {
            expect(res.headers['x-auth']).toBeFalsy()
        })
        .end((err, res) => {
            if (err) {
                return done(err)
            }
            User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0)
                done()
            }).catch((e) => done(e))
        })
    })
})