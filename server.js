// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

// our database is an array for now with some hardcoded values
var todos = [
   { _id: 1, task: 'Laundry', description: 'Wash clothes' },
   { _id: 2, task: 'Grocery Shopping', description: 'Buy dinner for this week' },
   { _id: 3, task: 'Homework', description: 'Make this app super awesome!' }
];

var nextID = 4;

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 *
 * The comments below give you an idea of the expected functionality
 * that you need to build. These are basic descriptions, for more
 * specifications, see the todosTest.js file and the outputs of running
 * the tests to see the exact details. BUILD THE FUNCTIONALITY IN THE
 * ORDER THAT THE TESTS DICTATE.
 */

app.get('/api/todos/search', function search(req, res) {
  var queryStr = req.query.q;
  console.log(req.query);
  console.log(queryStr);
  var newTodos = [];
  for(var i=0; i<todos.length; i++ ) {
    if(todos[i].task.search(queryStr) >= 0) {
      newTodos.push(todos[i]);
    }
  }
  res.json({todos: newTodos});
  /* This endpoint responds with the search results from the
   * query in the request. COMPLETE THIS ENDPOINT LAST.
   */
});

app.get('/api/todos', function index(req, res) {
  res.json({todos: todos});
  /* This endpoint responds with all of the todos
   */
});

app.post('/api/todos', function create(req, res) {
  var newToDo = req.body;
  newToDo._id = nextID;
  nextID++;
  todos.push(newToDo);
  res.json(newToDo);
  /* This endpoint will add a todo to our "database"
   * and respond with the newly created todo.
   */
});

app.get('/api/todos/:id', function show(req, res) {
  var searchID = parseInt(req.params.id);
  for (var i=0; i<todos.length; i++) {
    if(searchID === todos[i]._id){
      res.json(todos[i]);
    }
  }
  /* This endpoint will return a single todo with the
   * id specified in the route parameter (:id)
   */
});

app.put('/api/todos/:id', function update(req, res) {
  var searchID = parseInt(req.params.id);
  var updatedToDo = req.body;
  console.log("req body is "+updatedToDo);
  for (var i=0; i<todos.length; i++) {
    if(searchID === todos[i]._id) {
      updatedToDo._id=searchID;
      todos[i] = updatedToDo;
      res.json(updatedToDo);
    }
  }
  /* This endpoint will update a single todo with the
   * id specified in the route parameter (:id) and respond
   * with the newly updated todo.
   */
});

app.delete('/api/todos/:id', function destroy(req, res) {
  var searchID = parseInt(req.params.id);
  for (var i=0; i<todos.length; i++) {
    if(searchID === todos[i]._id) {
      res.json(todos[i]._id);
      todos.splice(i,1);
    }
  }
  /* This endpoint will delete a single todo with the
   * id specified in the route parameter (:id) and respond
   * with deleted todo.
   */
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(3000, function() {
  console.log('Server running on http://localhost:3000');
});
