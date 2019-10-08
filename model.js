const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema({
    todo_name: {
        type: String
    },
    todo_completed: {
        type: Boolean, default:false
    }
});

module.exports = mongoose.model('Todo', Todo);