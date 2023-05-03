// sdk object
const AWS = require('aws-sdk'),
      {
        DynamoDBDocument
      } = require("@aws-sdk/lib-dynamodb"),
      {
        DynamoDB
      } = require("@aws-sdk/client-dynamodb");
// configuring region
AWS.config.update({ region: 'eu-central-1' });
//instantiating a document client object which is easier to interact with than  the dynamodDB object
const docClient = DynamoDBDocument.from(new DynamoDB());

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

module.exports = {
    createItem,
    readItem,
    updateItem,
    deleteItem,
    queryTable,
    scanTable
}