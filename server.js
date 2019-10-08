const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ozan:ozan@mydb-lajoj.mongodb.net/mydb-lajoj?retryWrites=true&w=majority', {useUnifiedTopology:true,  useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

//GET
todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    }).sort({'_id':-1});
});

//ADD
todoRoutes.route('/add').post(function(req, res) {
    let todo =new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

//GET BY ID
todoRoutes.route('/:id').get(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        res.json(todo);
    })
});

//UPDATE
todoRoutes.route('/update').post(function(req, res) {
    Todo.findById(req.body._id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_name = req.body.todo_name;
            todo.todo_completed = req.body.todo_completed;
            todo.save().then(todo => {
            res.json('Todo updated!');
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

//CHANGE STATUS
todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_completed = !todo.todo_completed;
        todo.save().then(todo => {
            res.json('State updated!');
        })
            .catch(err => {
                res.status(400).send("State change not possible");
            });
    });
});


//DELETE BY ID
todoRoutes.route('/delete/:id').delete(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else

        todo.remove().then(todo => {
            res.json('State updated!');
        })
            .catch(err => {
                res.status(400).send("State change not possible");
            });
    });
});

app.use('/todos', todoRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});