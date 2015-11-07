import engine from 'engine.io-client';
import Client from './client';
import ui from './ui';

let socket = engine(location.origin);
let client;

socket.on('message', data => {
  const msg = JSON.parse(data);
  console.log('< msg:', msg);

  if (handlers[msg.type]) {
    handlers[msg.type](msg);
  }
});


const handlers = {
  init(msg) {
    const host = location.hostname;
    const port = location.port;
    const path = '/peer';
    const conn = new Peer(msg.id, {host, port, path});
    client = new Client(msg.id, conn, socket);
    conn.once('open', () => client.sendReady());
    conn.on('call', call => client.answerCall(call));
  },

  match(msg) {
    client.callPeer(msg.id);
  }
};