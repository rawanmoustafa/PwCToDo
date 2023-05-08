
//populates the data object if to do list json string is found it parses it into obj
//if not found it puts empty arrays
var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')):{
  todo: [], // gotta read from db
  completed: []
};



// Remove and complete icons in SVG format
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

const SERVER_NAME = window.location.origin;//"http://localhost:3000";
const REQUEST_PREFIX = "api";

// ITS CONSTANT FOR NOW
const USER_ID = localStorage.getItem('userId') ? localStorage.getItem('userId') : '0';

renderTodoList();
isLoggedIn();


//popup handling 
//----------------------------
document.getElementById('open-login-popup').addEventListener('click', function () {
  document.getElementById('login-popup').classList.remove('hidden');
});

document.getElementById('close-login-popup').addEventListener('click', function () {
  document.getElementById('login-popup').classList.add('hidden');
});



window.addEventListener('click', function (event) {
  if (event.target === document.getElementById('login-popup')) {
    document.getElementById('login-popup').classList.add('hidden');
  }
});


document.getElementById('open-register-popup').addEventListener('click', function () {
  document.getElementById('register-popup').classList.remove('hidden');
});

document.getElementById('close-register-popup').addEventListener('click', function () {
  document.getElementById('register-popup').classList.add('hidden');
});

window.addEventListener('click', function (event) {
  if (event.target === document.getElementById('register-popup')) {
    document.getElementById('register-popup').classList.add('hidden');
  }
});
//popup handling end
// -----------------------------


// User clicked on the add button
// If there is any text inside the item field, add that text to the todo list
document.getElementById('add').addEventListener('click', function() {
  var value = document.getElementById('item').value;
  if (value) {
    addItem(value);
  }
});

document.getElementById('item').addEventListener('keydown', function (e) {
  var value = this.value;
  if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value) {
    addItem(value);
  }
});

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  let url = `${SERVER_NAME}/${REQUEST_PREFIX}/login`;

  // Send a POST request to the server
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.userId);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('jwt', data.accessToken);
      location.reload();
      // Do something else with the token, like redirecting to another page
    })
    .catch(error => console.error(error));
});

const signOutButton = document.querySelector('#sign-out');

signOutButton.addEventListener('click', () => {

  let url = `${SERVER_NAME}/${REQUEST_PREFIX}/logout`;
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: localStorage.getItem('jwt') })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Clear the token from localStorage and redirect to the homepage or login page
      localStorage.removeItem('userId');
      localStorage.removeItem('jwt');

      window.location.href = '/';
    })
    .catch(error => console.error(error));
});

const registerForm = document.querySelector('#register-form');

registerForm.addEventListener('submit', (event) => {
  event.preventDefault(); // prevent the form from submitting in the default way
  let url = `${SERVER_NAME}/${REQUEST_PREFIX}/register`;

  // get the user input values
  const email = document.querySelector('#email-register').value;
  const password = document.querySelector('#password-register').value;
  console.log(email);

  // send a request to the server to register the user
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Do something with the response data, like displaying a success message or redirecting to another page
    })
    .catch(error => console.error(error));
});

async function getTasks (user_id){

  let url = `${SERVER_NAME}/${REQUEST_PREFIX}/get_tasks/`;
  url = url + encodeURIComponent(JSON.stringify(user_id));
  try{
    const response = await fetch(url);
    const data = await response.json();
    const tasks = data.map(item => item.Task);
    console.log(tasks);
    return tasks;
  }
  catch (error){
    console.log(error);
  }

  
  
}





function addItem (value) {
  addItemToDOM(value);
  document.getElementById('item').value = '';

  data.todo.push(value);
  dataObjectUpdated();

  //sending the request to serverside 
  let url = `${SERVER_NAME}/${REQUEST_PREFIX}/create_task`;
  
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ task: value ,user_id:USER_ID})
  })
  .then(response => {
    if (response.ok) {
      console.log("Item created successfully");
    } else {
      console.log("Error creating item");
      console.log(response)
    }
  })
  .catch(error => console.log(error));
  
}

function isLoggedIn(){
  // Check if the user is logged in
  const userId = localStorage.getItem('userId');
  if (userId) {
    // Show the logged-in div
    document.querySelector('.notlogged').style.display = 'none';
    document.querySelector('.logged').style.display = 'block';
    document.querySelector('#unnecessary-div').style.display = 'none';
    document.querySelector('#necessary-divs').style.display = 'block';

    
    
  } else {
    // Show the not-logged-in div
    document.querySelector('.notlogged').style.display = 'block';
    document.querySelector('.logged').style.display = 'none';
    document.querySelector('#necessary-divs').style.display = 'none';
    document.querySelector('#unnecessary-div').style.display = 'block';

  }
}

async function renderTodoList() {

  const tasks = await getTasks(USER_ID);
  data.todo = tasks;

  if (!data.todo.length && !data.completed.length) return;

  for (var i = 0; i < data.todo.length; i++) {
    var value = data.todo[i];
    addItemToDOM(value);
  }

  for (var j = 0; j < data.completed.length; j++) {
    var value = data.completed[j];
    addItemToDOM(value, true);
  }
}

function dataObjectUpdated() {
  let temp_data = {todo:data.todo, completed:[] }
  localStorage.setItem('todoList', JSON.stringify(temp_data));
}

function removeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.innerText;

  if (id === 'todo') {
    
    data.todo.splice(data.todo.indexOf(value), 1);
  } else {
    
    data.completed.splice(data.completed.indexOf(value), 1);
  }
  dataObjectUpdated();

  parent.removeChild(item);

  //fetching starts here
  //value is the sort key which is the content of the task
  let url = `${SERVER_NAME}/${REQUEST_PREFIX}/delete_task/`;
  const task = {userId: USER_ID , task:value,}
  url = url + encodeURIComponent(JSON.stringify(task));
    fetch(url, {
    method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(response);
    })
    .then(console.log('Item deleted:'))
    .catch(error => {
      console.error('Error deleting item:', error);
    });
}

function completeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.innerText;

  if (id === 'todo') {
    data.todo.splice(data.todo.indexOf(value), 1);
    data.completed.push(value);
  } else {
    data.completed.splice(data.completed.indexOf(value), 1);
    data.todo.push(value);
  }
  dataObjectUpdated();

  // Check if the item should be added to the completed list or to re-added to the todo list
  var target = (id === 'todo') ? document.getElementById('completed'):document.getElementById('todo');

  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);
}

// Adds a new item to the todo list
function addItemToDOM(text, completed) {
  var list = (completed) ? document.getElementById('completed'):document.getElementById('todo');

  var item = document.createElement('li');
  item.innerText = text;

  var buttons = document.createElement('div');
  buttons.classList.add('buttons');

  var remove = document.createElement('button');
  remove.classList.add('remove');
  remove.innerHTML = removeSVG;

  // Add click event for removing the item
  remove.addEventListener('click', removeItem);

  var complete = document.createElement('button');
  complete.classList.add('complete');
  complete.innerHTML = completeSVG;

  // Add click event for completing the item
  complete.addEventListener('click', removeItem);

  buttons.appendChild(remove);
  buttons.appendChild(complete);
  item.appendChild(buttons);

  list.insertBefore(item, list.childNodes[0]);
}
