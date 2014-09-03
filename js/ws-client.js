(function() {
  var wsUri
  var wsConsoleLog;
  var wsConnect;
  var wsDisconnect;
  var wsMessage;
  var wsSend;
  var wsClearLog;

  var wsUserDisconnectedFlag;

  function wsHandlePageLoad() {
    
    wsUri = document.getElementById("wsUri");
    wsUri.value = 'ws://'+window.location.hostname+':5010';

    wsConnect = document.getElementById("wsConnect");
    wsConnect.onclick = wsDoConnect;
    
    wsDisconnect = document.getElementById("wsDisconnect");
    wsDisconnect.onclick = wsDoDisconnect;
    
    wsMessage = document.getElementById("wsMessage");

    wsSend = document.getElementById("wsSend");
    wsSend.onclick = wsDoSend;

    wsConsoleLog = document.getElementById("wsConsoleLog");

    wsClearLog = document.getElementById("wsClearLog");
    wsClearLog.onclick = wsDoClearLog;

    wsUserDisconnectedFlag = false;
    
    wsSetGuiConnected(false);
  }

  function wsDoConnect() {

  	window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
      wsLogToConsole('<span style="color: red;"><strong>Error:</strong>' + 
          'Your browser does not have native support for WebSocket</span>',
          true);
      return;
    }
    wsConnect.disabled = true;
    websocket = new WebSocket(wsUri.value);
    websocket.onopen = function(evt) { wsOnOpen(evt) };
    websocket.onclose = function(evt) { wsOnClose(evt) };
    websocket.onmessage = function(evt) { wsOnMessage(evt) };
    websocket.onerror = function(evt) { wsOnError(evt) };
  }

  function wsDoDisconnect() {
    wsUserDisconnectedFlag = true;
    websocket.close()
  }
  
  function wsDoSend() {
    wsLogToConsole("SENT: " + wsMessage.value);
    websocket.send(wsMessage.value);
  }

  function wsLogToConsole(message) {
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = "";
    pre.innerHTML = pre.innerHTML+message;
    wsConsoleLog.appendChild(pre);

    while (wsConsoleLog.childNodes.length > 50) {
      wsConsoleLog.removeChild(wsConsoleLog.firstChild);
    }

    wsConsoleLog.scrollTop = wsConsoleLog.scrollHeight;
  }

  function wsOnOpen(evt) {
    wsLogToConsole("CONNECTED");
    wsSetGuiConnected(true);
  }
  
  function wsOnClose(evt) {
    wsLogToConsole("DISCONNECTED");

    wsUserDisconnectedFlag = false;

    wsSetGuiConnected(false);
  }
  
  function wsOnMessage(evt) {
    wsLogToConsole('<span style="font-size: 12px;color: blue;">RESPONSE: ' + evt.data+'</span>');
  }

  function wsOnError(evt) {
    wsLogToConsole('<span style="font-size: 12px;color: red;">ERROR:</span> ' + evt.data);
  }

  function wsSetGuiConnected(isConnected) {
  	wsUri.disabled = isConnected;
    wsConnect.disabled = isConnected;
    wsDisconnect.disabled = !isConnected;
    wsMessage.disabled = !isConnected;
    wsSend.disabled = !isConnected;
    labelColor = isConnected ? "#999999" : "black";
  }

  function wsDoClearLog() {
    while (wsConsoleLog.childNodes.length) {
      wsConsoleLog.removeChild(wsConsoleLog.lastChild);
    }
  }

  window.addEventListener("load", wsHandlePageLoad, false);

})();
