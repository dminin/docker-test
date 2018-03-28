require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser')
const todoDao = require('./todoDao');

const app = express();
app.use(bodyParser.json());

function translateTodo(todo) {
    return todo && {
        title: todo.title,
        status: todo.status,
        _meta: {
            id: todo._id
        }
    };
}

app.get('/todos', (req, res) => {
    todoDao.listTodos()
        .then((v) => v.map(translateTodo))
        .then((v) => res.send(v))
        .catch((e) => {
            console.log(e);
            res.status(500);
            res.send(e);
        });
});
app.get('/todos/:id', (req, res) => {
    todoDao.getTodoById(req.params.id)
        .then(translateTodo)
        .then((v) => {
            if (v) {
                res.send(v)
            } else {
                res.status(404);
                res.send();
            }
        })
        .catch((e) => {
            console.log(e);
            res.status(500);
            res.send(e);
        });
});
app.post('/todos', (req, res) => {
    todoDao.createTodo(req.body)
        .then(translateTodo)
        .then((v) => res.send(v))
        .catch((e) => {
            console.log(e);
            res.status(500);
            res.send(e);
        });
});
app.delete('/todos/:id', (req, res) => {
    todoDao.deleteTodo(req.params.id)
        .then((v) => {
            res.status(204);
            res.send();
        })
        .catch((e) => {
            console.log(e);
            res.status(500);
            res.send(e);
        });
});
app.put('/todos/:id', (req, res) => {
    const updated = {
        title: req.body.title,
        status: req.body.status
    };
    todoDao.updateTodo(req.params.id, req.body)
        .then(translateTodo)
        .then((v) => {
            if (v) {
                res.send(v)
            } else {
                res.status(404);
                res.send();
            }
        })
        .catch((e) => {
            console.log(e);
            res.status(500);
            res.send(e);
        });
});

app.listen(3000, () => console.log('Listening on port 3000!'));
