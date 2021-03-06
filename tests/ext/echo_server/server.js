var port = 8080,
  WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({ port: port }),
  clearEchoWss = new WebSocketServer({ port: 9999 });

  console.log('listening on port: ' + port);
  console.log('and on port: ' + 9999);

wss.on('connection', function connection(ws) {
  ws.on('message', function(message) {
    if(message == "close-me-1") {
      ws.close(1001);
    }
    else if(message == "close-me-2") {
      ws.close(1002);
    } 
    else if(message == "close-me-3") {
      ws.close(1003);
    } else {
      ws.send('ECHO: ' + message);
    }
  });

  ws.on('close', function(code, reason) {
    console.log("Connection closed, code: " + code + ", reson: " + reason);
  })

    console.log('new client connected!');
});


clearEchoWss.on('connection', function connection(ws) {
  ws.on('message', function(message) {
      ws.send(message);
    }
  );
});
