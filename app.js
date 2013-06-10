var express = require('express');
var WebSocketServer = require('websocket').server;
var http = require('http');
var app = express();

app.configure(function(){
  app.set('port', 1337);
  app.set("view options", {layout: false});
  app.engine('html', require('ejs').renderFile);
  app.use(express.static(__dirname));
});
app.get('/', function(req, res) {

    res.render('shareHtml5.html');
});

// spin up server
app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var _httpServer = http.createServer(app)

var clients = [];

// create the server
wsServer = new WebSocketServer({
    httpServer: _httpServer
});

// WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin);
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
          // process WebSocket message
          clients.forEach(function(client){
            client.sendUTF(message.utf8Data);
          });
        }
    });

    connection.on('close', function(connection) {
        // close user connection
        clients.splice(index, 1);
    });
});

_httpServer.listen(3000);