let mongoose = require('mongoose')

mongoose.Promise = global.Promise

let db = {
    localhost: 'mongodb://localhost:27017/TodoApp',
    mlab: 'mongodb://st-jon:1dealcrash@ds247430.mlab.com:47430/todo-app-api-st-jon'
  };
  mongoose.connect( db.localhost || db.mlab)


module.exports = {
    mongoose
}