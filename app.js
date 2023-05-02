const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const TaskModel = require('./db/tasks');
const TABLE_NAME = 'Tasks'
const USER_ID = '0';

// serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// define a route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

//defining route prefix
const API_PREFIX = "api";

app.get(`/${API_PREFIX}/create_task/:params`, (req, res) => {

  console.log("function called");

  //params = req.body;
  
  const task = JSON.parse(decodeURIComponent(req.params.params));
  
  const params = {
    TableName: TABLE_NAME,
    Item: {
      UserId: USER_ID,
      Task: task
    }
  }
  
  res.send(TaskModel.createItem(params)
    .then(console.log("item created succesfuly"))
    .catch(err => console.log(err)));

  
  
  //TaskModel.createItem(req.params)
});

app.post(`${API_PREFIX}`, (req, res) => {
  res.send('get method recieved')
});

// start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



