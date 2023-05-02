const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// define a route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// sdk object
const AWS = require('aws-sdk');
// configuring region
AWS.config.update({ region: 'eu-central-1' });
//instantiating a document client object which is easier to interact with than  the dynamodDB object
const docClient = new AWS.DynamoDB.DocumentClient();

// create a new item
const createItem = (params) => {
  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// read an item by primary key
const readItem = (params) => {
  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Item);
      }
    });
  });
};

// update an item
const updateItem = (params) => {
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// delete an item by primary key
const deleteItem = (params) => {
  return new Promise((resolve, reject) => {
    docClient.delete(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// query the table
const queryTable = (params) => {
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Items);
      }
    });
  });
};

// scan the table
const scanTable = (params) => {
  return new Promise((resolve, reject) => {
    docClient.scan(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Items);
      }
    });
  });
};

