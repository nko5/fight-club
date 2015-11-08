import path from 'path';
import express from 'express';
import engine from 'engine.io';
import {ExpressPeerServer} from 'peer';
import matcher from './matcher';
import Client from './client';

const app = express();
const staticPath = path.resolve(__dirname, '../public');

app.use(express.static(staticPath));

const http = app.listen(8080, err => {
  if (err) throw err;
  console.log('listening on port:', 8080);
});

// start our own peerjs signalling server
app.use('/peer', ExpressPeerServer(http));

const sockets = {};
const reswait = {};

engine.attach(http).on('connection', socket => {
  const client = new Client(socket);
  sockets[client.id] = client;

  // send a randomly generated client.id
  // this id will be used as peerJS peerId
  client.sendMsg({type: 'init', id: client.id});

  socket.on('message', data => {
    const msg = JSON.parse(data);
    console.log('< msg:', msg);

    if (handlers[msg.type]) {
      handlers[msg.type](client, msg);
    }
  });

  socket.on('close', () => {
    delete sockets[client.id];
    delete reswait[client.id];
    matcher.remove(client.id);
  });
});

const handlers = {
  ready(client, msg) {
    const waiting = matcher.getWaiting();
    if (waiting) {
      matcher.setWaiting(null);
    } else {
      matcher.setWaiting(client.id);
    }

    client.sendMatch(waiting);
  },

  schedule(client, msg) {
    const opponent = sockets[msg.opponent];
    if (!opponent) {
      client.sendTime(null);
      return;
    }

    const ts = Date.now() + 2000 + Math.floor(5000 * Math.random());
    client.sendTime(ts);
    opponent.sendTime(ts);
  },

  restime(client, msg) {
    const opponent = sockets[msg.opponent];
    if (!opponent) {
      client.sendResult(null);
      return;
    }

    const opponentRestime = reswait[opponent.id];
    if (!opponentRestime) {
      reswait[client.id] = msg.millis;
      return;
    }

    if (opponentRestime > msg.millis) {
      client.sendResult(client.id);
      opponent.sendResult(client.id);
    } else {
      client.sendResult(opponent.id);
      opponent.sendResult(opponent.id);
    }
  },
};
