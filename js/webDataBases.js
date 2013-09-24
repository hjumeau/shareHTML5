(function(){

    var webdb = {};
    webdb.db = null;
    var addTodoButton = document.getElementById("addTodo");

    webdb.open = function() {
      var dbSize = 5 * 1024 * 1024; // 5MB
      webdb.db = openDatabase("Todo", "1.0", "Todo manager", dbSize);
    }

    webdb.createTable = function() {
      var db = webdb.db;
      db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS todo(ID INTEGER PRIMARY KEY ASC, todo TEXT, added_on DATETIME)", []);
      });
    }

    webdb.addTodo = function(todoText) {
      var db = webdb.db;
      db.transaction(function(tx){
        var addedOn = new Date();
        tx.executeSql("INSERT INTO todo(todo, added_on) VALUES (?,?)",
            [todoText, addedOn],
            webdb.onSuccess,
            webdb.onError);
       });
    }

    webdb.onError = function(tx, e) {
      alert("There has been an error: " + e.message);
    }

    webdb.onSuccess = function(tx, r) {
      // re-render the data.
      webdb.getAllTodoItems(loadTodoItems);
    }


    webdb.getAllTodoItems = function(renderFunc) {
      var db = webdb.db;
      db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM todo", [], renderFunc,
            webdb.onError);
      });
    }

    webdb.deleteTodo = function(id) {
      var db = webdb.db;
      db.transaction(function(tx){
        tx.executeSql("DELETE FROM todo WHERE ID=?", [id],
            webdb.onSuccess,
            webdb.onError);
        });
    }

    function loadTodoItems(tx, rs) {
      var todoItems = document.getElementById("todoItems");
      todoItems.innerHTML = "";
      for (var i=0; i < rs.rows.length; i++) {
        todoItems.innerHTML += renderTodo(rs.rows.item(i));
        var row = document.getElementById("webdb_"+rs.rows.item(i).ID);
        var rowID = rs.rows.item(i).ID;
        var onClick = function(){
          webdb.deleteTodo(rowID);
        };
        row.onclick = onClick;
      }
    }

    function renderTodo(row) {
      return "<li>" + row.todo  + " [<a href='#' id=" + "webdb_" + row.ID + ">Delete</a>]</li>";
    }

    function init() {
      webdb.open();
      webdb.createTable();
      webdb.getAllTodoItems(loadTodoItems);
      addTodoButton.onclick = addTodo;
    }

    function addTodo() {
      var todo = document.getElementById("todo");
      webdb.addTodo(todo.value);
      todo.value = "";
    }

    window.addEventListener("load", init, false);
})();