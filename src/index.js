const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const userExist = users.find(user => user.username === username);

  if(!userExist) {
    return response.status(404).json({ error: 'User not found' });
  }

  request.userAccount = userExist;

  next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userExists = users.find(user => user.username === username);

  if(userExists) {
    return response.status(400).json({ error: 'User already exist' });
  }
  
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { userAccount } = request;

  return response.status(201).json(userAccount.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { userAccount } = request;
  const { title, deadline } = request.body;

  if(!title && !deadline) {
    return response
      .status(400)
      .json({ error: 'Title or deadline not can null' });
  }

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  userAccount.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { userAccount } = request;
  const { title, deadline } = request.body;

  const todoExist = userAccount.todos.find(todo => todo.id == id);

  if(!todoExist) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  todoExist.title = title;
  todoExist.deadline = deadline;

  return response.status(200).json(todoExist);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { userAccount } = request;

  const todoExist = userAccount.todos.find(todo => todo.id == id);

  if(!todoExist) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  todoExist.done = true;

  return response.status(200).json(todoExist);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { userAccount } = request;

  const todoExist = userAccount.todos.find(todo => todo.id == id);

  if(!todoExist) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  userAccount.todos.splice(todoExist, 1);

  return response.status(204).json();
});

module.exports = app;