const AWS = require('aws-sdk');
// Configure AWS credentials
AWS.config.update({
  region: 'eu-central-1'
});

//identity pool ID: eu-central-1:8106c104-5b45-438d-8803-8b2a75342eb5



// Initialize CognitoIdentityServiceProvider
const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
});

//const userPoolId = 'eu-central-1_ljrt04eto';
const clientId = '4il1o95ebqil0s64ofm4ep21j8';

// Register a new user
async function registerUser(email, password) {
  const params = {
    ClientId: clientId,
    Password: password,
    Username: email,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
  };

  try {
    const result = await cognito.signUp(params).promise();
    console.log('User registered:', result);
    return result;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// Authenticate a user (login)
async function loginUser(email, password) {
  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  try {
    const result = await cognito.initiateAuth(params).promise();
    console.log('User logged in:', result);
    return result;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}

// Logout the currently signed-in user
async function logoutUser(accessToken) {
  const params = {
    AccessToken: accessToken
  };

  try {
    const result = await cognito.globalSignOut(params).promise();
    console.log('User logged out:', result);
    return result;
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
}

module.exports = { registerUser, loginUser, logoutUser };