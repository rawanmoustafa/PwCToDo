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
  
  res.send(
    TaskModel.createItem(params)
      .then(console.log("item created succesfuly"))
      .catch(err => console.log(err))
  );

  
  
  //TaskModel.createItem(req.params)
});

app.get(`/${API_PREFIX}/get_tasks/:user_id`, (req, res) => {
  // no need for the userid to be passed here
  const user_id = req.params.user_id.replace(/"/g, '');
  console.log("GET TASKS FOR USERID: " + user_id);
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "#pk = :pk",
    ExpressionAttributeNames: {
      "#pk": "UserId"
    },
    ExpressionAttributeValues: {
      ":pk": user_id
    }
  };
  
  TaskModel.queryTable(params)
    .then(item => {console.log(item);res.send(item);})
    .catch(err => console.log(err))
  
});

app.delete(`/${API_PREFIX}/delete_task/:params`, async (req, res) => {
  
  const task = JSON.parse(decodeURIComponent(req.params.params));

  console.log("DELETE: " + task)
  const params = {
    TableName: TABLE_NAME,
    Key: {
      UserId: USER_ID,
      Task: task,

    },
  };
  try {
    await TaskModel.deleteItem(params);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

app.post(`${API_PREFIX}`, (req, res) => {
  res.send('get method recieved')
});

// start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



