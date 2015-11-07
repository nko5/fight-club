import engine from 'engine.io-client';
import Client from './client';
import {getWebcam, showStream} from './util/webcam';

const handlers = {};

handlers['init'] = (client, msg) => {
  client.id = msg.id;
  client.peer = new Peer(client.id, {
    host: location.hostname,
    port: 8080,
    path: '/peer',
  });

  client.peer.on('open', function () {
    client.sendMsg({type: 'ready'});
  });

  client.peer.on('call', function(call) {
    getWebcam().then((stream) => {
      call.answer(stream);
      call.on('stream', showStream);
    });
  });
};

handlers['match'] = (client, msg) => {
  getWebcam().then((stream) => {
    var call = client.peer.call(msg.id, stream);
    call.on('stream', showStream);
  });
};

let socket = engine(location.origin);
let client = new Client(socket);

socket.on('message', data => {
  const msg = JSON.parse(data);
  console.log('< msg:', msg);

  if (handlers[msg.type]) {
    handlers[msg.type](client, msg);
  }
});
