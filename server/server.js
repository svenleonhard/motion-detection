express = require('express');
http = require('http');
ws = require('ws');
amqp = require('amqplib/callback_api');

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new ws.Server({ server });

websocket_connections = []

wss.on('connection', (websocket) => {

    console.log('new websocket connection');

    //connection is up, let's add a simple simple event
    websocket.on('message', (message) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        websocket.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection    
    websocket.send('connected');
    websocket_connections.push(websocket)
    
});


//initialize messaging 
var queue = 'observation';
amqp.connect('amqp://rabbit', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    } 

    channel.assertQueue(queue, {
      durable: false
    });

    channel.consume(queue, function(msg) {
        console.log('consumed new message')
        websocket_connections.forEach(websocket => {
            console.log('send motion capture to client')
            websocket.send(msg.content.toString())
        });

      }, {
          noAck: true
        });

  });
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});