// wait for DOM to load before running JS
$(document).ready(function() {

  var app = new App();
  app.render();
  app.getTodos();

  function App() {
    this.baseUrl = '/api/todos';
    this.allTodos= [];
    this.$todosList = $('#todos-list');
    this.$createTodo = $('#create-todo');
    this.source = $('#todos-template').html();
    this.template = Handlebars.compile(source);
  }

  App.prototype = {
    render: function() {
      this.$todosList.empty();
      var todosHTML = template({ todos: allTodos });
      this.$todosList.append(todosHTML);
    },
    getTodos: function() {
      var self=this;
      $.ajax({
        method: "GET",
        url: self.baseUrl,
        success: function onIndexSuccess(json) {
          self.allTodos = json.todos;
          self.render();
        }
      });
    },

  };

  // GET all todos on page load
  $.ajax({
    method: "GET",
    url: baseUrl,
    success: function onIndexSuccess(json) {
      console.log(json);

      // set `allTodos` to todo data (json.data) from API
      allTodos = json.todos;

      // render all todos to view
      render();
    }
  });

  // listen for submit even on form
  $createTodo.on('submit', function (event) {
    event.preventDefault();

    // serialze form data
    var newTodo = $(this).serialize();

    // POST request to create new todo
    $.ajax({
      method: "POST",
      url: baseUrl,
      data: newTodo,
      success: function onCreateSuccess(json) {
        console.log(json);

        // add new todo to `allTodos`
        allTodos.push(json);

        // render all todos to view
        render();
      }
    });

    // reset the form
    $createTodo[0].reset();
    $createTodo.find('input').first().focus();
  });

  // add event-handlers to todos for updating/deleting
  $todosList

    // for update: submit event on `.update-todo` form
    .on('submit', '.update-todo', function (event) {
      event.preventDefault();

      // find the todo's id (stored in HTML as `data-id`)
      var todoId = $(this).closest('.todo').attr('data-id');

      // find the todo to update by its id
      var todoToUpdate = allTodos.filter(function (todo) {
        return todo._id == todoId;
      })[0];

      // serialze form data
      var updatedTodo = $(this).serialize();

      // PUT request to update todo
      $.ajax({
        type: 'PUT',
        url: baseUrl + '/' + todoId,
        data: updatedTodo,
        success: function onUpdateSuccess(json) {
          // replace todo to update with newly updated version (json)
          allTodos.splice(allTodos.indexOf(todoToUpdate), 1, json);

          // render all todos to view
          render();
        }
      });
    })

    // for delete: click event on `.delete-todo` button
    .on('click', '.delete-todo', function (event) {
      event.preventDefault();

      // find the todo's id (stored in HTML as `data-id`)
      var todoId = $(this).closest('.todo').attr('data-id');

      // find the todo to delete by its id
      var todoToDelete = allTodos.filter(function (todo) {
        return todo._id == todoId;
      })[0];

      // DELETE request to delete todo
      $.ajax({
        type: 'DELETE',
        url: baseUrl + '/' + todoId,
        success: function onDeleteSuccess(json) {
          // remove deleted todo from all todos
          allTodos.splice(allTodos.indexOf(todoToDelete), 1);

          // render all todos to view
          render();
        }
      });
    });

});
