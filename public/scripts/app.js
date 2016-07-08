// wait for DOM to load before running JS
$(document).ready(function() {

  function App() {
    this.baseUrl = '/api/todos';
    this.allTodos= [];
    this.$todosList = $('#todos-list');
    this.$createTodo = $('#create-todo');
    this.source = $('#todos-template').html();
    this.template = Handlebars.compile(this.source);
  }

  App.prototype = {
    render: function() {
      this.$todosList.empty();
      var todosHTML = this.template({ todos: this.allTodos });
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
    submitNewTodo: function() {
      // listen for submit even on form
      this.$createTodo.on('submit', function (event) {
        event.preventDefault();

        // serialze form data
        var newTodo = $(this).serialize();

        // POST request to create new todo
        $.ajax({
          method: "POST",
          url: this.baseUrl,
          data: newTodo,
          success: function onCreateSuccess(json) {
            console.log(json);

            // add new todo to `allTodos`
            this.allTodos.push(json);

            // render all todos to view
            this.render();
          }
        });
        // reset the form
        this.$createTodo[0].reset();
        this.$createTodo.find('input').first().focus();
      });
    }

  };

  var app = new App();
  app.getTodos();
  app.submitNewTodo();
  app.render();





  // add event-handlers to todos for updating/deleting
  app.$todosList

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