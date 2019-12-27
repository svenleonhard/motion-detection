express = require('express');
http = require('http');
ws = require('ws');
amqp = require('amqplib/callback_api');

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new ws.Server({ server });

websocket_instance = null

wss.on('connection', (ws) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
    websocket_instance = ws
});


//initialize messaging 
var queue = 'hello';
amqp.connect('amqp://localhost', function(error0, connection) {
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
        //console.log(msg.content.toString());
        console.log('new motion')
        console.log(ws)
        if(websocket_instance){
            websocket_instance.send('new motion')
        }

      }, {
          noAck: true
        });

  });
});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});