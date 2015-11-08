import engine from 'engine.io-client';
import Client from './client';
import ui from './ui';
import './gameui/';

window.startGame = function () {
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
      client = new Client(msg.id, socket);
      client.initialize();
    },

    match(msg) {
      if (msg.id) {
        client.initiateFight(msg.id);
      }
    },

    time(msg) {
      if (!msg.ts) {
        throw new Error('TODO: reconnect with another player');
      }

      client.trackRestime(msg.ts);
    },

    result(msg) {
      if (msg.id === client.id) {
        ui.showWinMessage();
      } else {
        ui.showLoseMessage();
      }

      if (client.isCaller) {
        client.sendSchedule();
      }
    },
  };
}
