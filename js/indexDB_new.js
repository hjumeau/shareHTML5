(function () {       
// indexeddb
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

var html5rocks = {}; // namespace (not required)
html5rocks.indexedDB = {}; // open, addTodo, getAllTodoItems, deleteTodo - are own methods
html5rocks.indexedDB.db = null; // holds the real instance of the indexedDB

var addTodoButton = document.getElementById("addTodoIndexedDB");
addTodoButton.onclick = function (e) {
        var todo = document.getElementById("todoIndexedDB")
        html5rocks.indexedDB.addTodo(todo.value);
        return false;
};

// open/create
html5rocks.indexedDB.open = function() {
        // you must increment the version by +1 in order to get the 'onupgradeneeded' event called
        // ONLY there you can modify the db itself e.g create new object stores and etc.
        var request = indexedDB.open('todos', 5);
        console.log(request);
       
        request.onupgradeneeded = function(e) {
                console.log('onupgradeneeded', e);

                html5rocks.indexedDB.db = e.target.result;
                var db = html5rocks.indexedDB.db;
                console.log('db', db);

                if(!db.objectStoreNames.contains('todo')){
                        db.createObjectStore('todo', {keyPath: 'timeStamp', autoIncrement: true});
                }
        };

        request.onsuccess = function(e) {
                console.log('onsuccess', e);
                html5rocks.indexedDB.db = e.target.result;
                var db = html5rocks.indexedDB.db;
                console.log('db', db);

                // START chrome (obsolete - will be removed)
                if (typeof db.setVersion === 'function') {
                        var versionReq = db.setVersion(3);
                        versionReq.onsuccess = function (e) {
                                console.log('versionReq', e);

                                html5rocks.indexedDB.db = e.target.source; // instead of result
                                var db = html5rocks.indexedDB.db;
                                console.log('db', db);

                                if(!db.objectStoreNames.contains('todo')){
                                        db.createObjectStore('todo', {keyPath: 'timeStamp', autoIncrement: true});
                                }
                        }
                }
                // END chrome

                html5rocks.indexedDB.getAllTodoItems();
        };
};

// add
html5rocks.indexedDB.addTodo = function(todoText) {
        var db = html5rocks.indexedDB.db;
        var trans = db.transaction(['todo'], 'readwrite');
        var store = trans.objectStore('todo');
        var request = store.put({
                'text': todoText,
                'timeStamp' : new Date().getTime()
        });

        request.onsuccess = function(e) {
                // Re-render all the todo's
                html5rocks.indexedDB.getAllTodoItems();
        };

        request.onerror = function(e) {
                console.log(e.value);
        };
};

// read
html5rocks.indexedDB.getAllTodoItems = function() {
        var todos = document.getElementById("todoItemsIndexDB");
        todos.innerHTML = "";
       
        var db = html5rocks.indexedDB.db;
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

        cursorRequest.onerror = html5rocks.indexedDB.onerror;
};

// delete
html5rocks.indexedDB.deleteTodo = function(id) {
        var db = html5rocks.indexedDB.db;
        var trans = db.transaction(['todo'], 'readwrite');
        var store = trans.objectStore('todo');

        var request = store.delete(id);

        request.onsuccess = function(e) {
                html5rocks.indexedDB.getAllTodoItems();  // Refresh the screen
        };

        request.onerror = function(e) {
                console.log(e);
        };
};

// helper
function renderTodo(row) {
        var todos = document.getElementById("todoItemsIndexDB");
        var li = '<li>'+row.text+'<a href="#" class="delete">[Delete]</a><span>'+row.timeStamp+'</span></li>';
        todos.innerHTML = li;
}

/*$('#todos').on('click', '.delete', function (e) {
        html5rocks.indexedDB.deleteTodo(parseInt($(this).parent().find('span').text()));
        return false;
});*/

html5rocks.indexedDB.open(); // open displays the data previously saved

})();
 