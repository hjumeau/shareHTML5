(function () {       
// indexeddb
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

var todoIndexedDB = {db: null}; // open, addTodo, getAllTodoItems, deleteTodo - are own methods

var addTodoButton = document.getElementById("addTodoIndexedDB");
addTodoButton.onclick = function (e) {
        var todo = document.getElementById("todoIndexedDB")
        todoIndexedDB.addTodo(todo.value);
        return false;
};

// open/create
todoIndexedDB.open = function() {
        // you must increment the version by +1 in order to get the 'onupgradeneeded' event called
        // ONLY there you can modify the db itself e.g create new object stores and etc.
        var request = indexedDB.open('todos', 5);
       
        request.onupgradeneeded = function(e) {
                todoIndexedDB.db = e.target.result;
                var db = todoIndexedDB.db;

                if(!db.objectStoreNames.contains('todo')){
                        db.createObjectStore('todo', {keyPath: 'timeStamp', autoIncrement: true});
                }
        };

        request.onsuccess = function(e) {
                todoIndexedDB.db = e.target.result;
                todoIndexedDB.getAllTodoItems();
        };
};

// add
todoIndexedDB.addTodo = function(todoText) {
        var db = todoIndexedDB.db;
        var trans = db.transaction(['todo'], 'readwrite');
        var store = trans.objectStore('todo');
        var request = store.put({
                'text': todoText,
                'timeStamp' : new Date().getTime()
        });

        request.onsuccess = function(e) {
                // Re-render all the todo's
                todoIndexedDB.getAllTodoItems();
        };

        request.onerror = function(e) {
                console.log(e.value);
        };
};

// read
todoIndexedDB.getAllTodoItems = function() {
        var todos = document.getElementById("todoItemsIndexDB");
        todos.innerHTML = "";
       
        var db = todoIndexedDB.db;
        var trans = db.transaction(['todo'], 'readwrite');
        var store = trans.objectStore('todo');

        // Get everything in the store;
        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = store.openCursor(keyRange);

        cursorRequest.onsuccess = function(e) {
                var result = e.target.result;
                if(!!result == false)
                        return;

                renderTodo(result.value);
                result.continue();
        };
};

// delete
todoIndexedDB.deleteTodo = function(id) {
        var db = todoIndexedDB.db;
        var trans = db.transaction(['todo'], 'readwrite');
        var store = trans.objectStore('todo');

        var request = store.delete(id);

        request.onsuccess = function(e) {
                todoIndexedDB.getAllTodoItems();  // Refresh the screen
        };

        request.onerror = function(e) {
                console.log(e);
        };
};

// helper
function renderTodo(row) {
        var todos = document.getElementById("todoItemsIndexDB");
        var li = document.createElement("li");
        var a = document.createElement("a");
        var t = document.createTextNode(row.text);

        a.addEventListener("click", function(e) {
                todoIndexedDB.deleteTodo(row.timeStamp);
        });
        a.textContent = " [Delete "+row.timeStamp+"]";
        a.classList.add("delete");

        li.appendChild(t);
        li.appendChild(a);
        todos.appendChild(li);
}

todoIndexedDB.open(); // open displays the data previously saved

})();
 