import engine from 'engine.io-client';
import Client from './client';
import ui from './ui';
import './gameui/';

function startGameWithIce() {
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
        client.sendReady();
        return;
      }

      client.trackRestime(msg.ts);
    },

    damage(msg) {
      client.updateDamage(msg.act, msg.count);

      if (msg.count === 10) {
        client.stopTracking();
        ui.showLoseMessage();
        client.sendRestime(1e9);
      }
    },

    result(msg) {
      if (msg.id === client.id) {
        ui.showWinMessage();
      } else {
        ui.showLoseMessage();
      }

      client.sendReady();
    },
  };
}

window.startGame = function () {
  $(document).ready(function() {
    $.get("https://service.xirsys.com/ice", {
        ident: "mnmtanish",
        secret: "aff40fbc-864a-11e5-81e7-bf4681af6943",
        domain: "kadira.2015.nodeknockout.com",
        application: "default",
        room: "default",
        secure: 1
      }, function(data, status) {
        window.iceServers = data.d.iceServers;
        startGameWithIce();
      }
    );
  });
}
