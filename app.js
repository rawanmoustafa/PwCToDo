const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

const TaskModel = require('./db/tasks');
const CognitoAuth = require('./cognito');
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

app.post(`/${API_PREFIX}/create_task`, (req, res) => {
  
  const task = req.body.task; // assuming the request body contains a JSON object with a "task" property
  const user_id = req.body.user_id;
  
  const params = {
    TableName: TABLE_NAME,
    Item: {
      UserId: user_id,
      Task: task
    }
  }
  
  TaskModel.createItem(params)
    .then(() => {
      console.log("Item created successfully");
      res.status(200).send("Item created successfully");
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
    
});

app.post(`/${API_PREFIX}/login`, async (req, res) => {
  
  const email = req.body.email; // assuming the request body contains a JSON object with a "mail" and "password" property
  const password = req.body.password;
  
  
  try {
    const token = await CognitoAuth.loginUser(email,password);
    const access_token = token.AuthenticationResult.AccessToken;
    const auth_token = token.AuthenticationResult.IdToken;
    const decodedToken = jwt.decode(auth_token, { complete: true });
    // Extract the user ID from the payload
    const userId = decodedToken.payload.sub;
    console.log(userId);
    res.status(200).json({"userId":userId, "accessToken" : access_token});
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
  
  
});


app.post(`/${API_PREFIX}/register`, async (req, res) => {
  
  const email = req.body.email; // assuming the request body contains a JSON object with a "mail" and "password" property
  const password = req.body.password;
  
  
  try {
    await CognitoAuth.registerUser(email,password);
    
    res.status(200).json({status : "user registered"});
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
  
  
});


app.post(`/${API_PREFIX}/logout`, async (req, res) => {
  
  const token = req.body.token; // assuming the request body contains a JSON object with a "token" and "password" property
  
  
  try {
    await CognitoAuth.logoutUser(token);
    res.status(200).json({status:"token removed"});
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
  
  
});

app.get(`/${API_PREFIX}/get_tasks/:user_id`, (req, res) => {
  // no need for the userid to be passed here
  const user_id = req.params.user_id.replace(/"/g, '');
  //console.log("GET TASKS FOR USERID: " + user_id);
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
  
  const taskObj = JSON.parse(decodeURIComponent(req.params.params));
  //console.log("TASK: " + task.userId);
  //console.log("DELETE: " + task)
  
  const params = {
    TableName: TABLE_NAME,
    Key: {
      UserId: taskObj.userId,
      Task: taskObj.task,

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



