(function(){

    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

    if ('webkitIndexedDB' in window) {
      window.IDBTransaction = window.webkitIDBTransaction;
      window.IDBKeyRange = window.webkitIDBKeyRange;
    }

    var indexedDB = {};
    indexedDB.db = null;
    var addTodoButton = document.getElementById("addTodoIndexedDB");

    indexedDB.onerror = function(e) {
      console.log(e);
    };

    indexedDB.open = function() {
      var request = indexedDB.open("todos");

      request.onsuccess = function(e) {
        var v = 1;
        indexedDB.db = e.target.result;
        var db = indexedDB.db;
        // We can only create Object stores in a setVersion transaction;
        if (v != db.version) {
          var setVrequest = db.setVersion(v);

          // onsuccess is the only place we can create Object Stores
          setVrequest.onerror = indexedDB.onerror;
          setVrequest.onsuccess = function(e) {
            if(db.objectStoreNames.contains("todo")) {
              db.deleteObjectStore("todo");
            }

            var store = db.createObjectStore("todo",
              {keyPath: "timeStamp"});
            e.target.transaction.oncomplete = function() {
              indexedDB.getAllTodoItems();
            };
          };
        } else {
          request.transaction.oncomplete = function() {
            indexedDB.getAllTodoItems();
          };
        }
      };
      request.onerror = indexedDB.onerror;
    };

    indexedDB.addTodo = function(todoText) {
      var db = indexedDB.db;
      var trans = db.transaction(["todo"], "readwrite");
      var store = trans.objectStore("todo");

      var data = {
        "text": todoText,
        "timeStamp": new Date().getTime()
      };

      var request = store.put(data);

      request.onsuccess = function(e) {
        indexedDB.getAllTodoItems();
      };

      request.onerror = function(e) {
        console.log("Error Adding: ", e);
      };
    };

    indexedDB.deleteTodo = function(id) {
      var db = indexedDB.db;
      var trans = db.transaction(["todo"], "readwrite");
      var store = trans.objectStore("todo");

      var request = store.delete(id);

      request.onsuccess = function(e) {
        indexedDB.getAllTodoItems();
      };

      request.onerror = function(e) {
        console.log("Error Adding: ", e);
      };
    };

    indexedDB.getAllTodoItems = function() {
      var todos = document.getElementById("todoItems");
      todos.innerHTML = "";

      var db = indexedDB.db;
      var trans = db.transaction(["todo"], "readwrite");
      var store = trans.objectStore("todo");

      // Get everything in the store;
      var cursorRequest = store.openCursor();

      cursorRequest.onsuccess = function(e) {
        var result = e.target.result;
        if(!!result == false)
          return;

        renderTodo(result.value);
        result.continue();
      };

      cursorRequest.onerror = indexedDB.onerror;
    };

    function renderTodo(row) {
      var todos = document.getElementById("todoItems");
      var li = document.createElement("li");
      var a = document.createElement("a");
      var t = document.createTextNode(row.text);

      a.addEventListener("click", function() {
        indexedDB.deleteTodo(row.timeStamp);
      }, false);

      a.textContent = " [Delete]";
      li.appendChild(t);
      li.appendChild(a);
      todos.appendChild(li);
    }

    function addTodo() {
      var todo = document.getElementById("todoIndexedDB");
      indexedDB.addTodo(todo.value);
      todo.value = "";
    }

    function initIndexedDB() {
      indexedDB.open();
      addTodoButton.onclick = addTodo;
    }

    window.addEventListener("load", initIndexedDB, false);​
})();