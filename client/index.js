import engine from 'engine.io-client';
import Client from './client';
import {getWebcam, showStream} from './util/webcam';

const handlers = {};

handlers['init'] = (msg) => {
  const host = location.hostname;
  const port = location.port;
  const peer = new Peer(client.id, {host, port, path: '/peer'});
  client = new Client(msg.id, peer, socket);
  peer.once('open', () => client.sendReady());
  peer.on('call', () => client.answerCall(call));
};

handlers['match'] = (client, msg) => {
  client.startMatch(msg.id);
};

let socket = engine(location.origin);
let client = new Client(socket);

socket.on('message', data => {
  const msg = JSON.parse(data);
  console.log('< msg:', msg);

  if (handlers[msg.type]) {
    handlers[msg.type](msg);
  }
});
