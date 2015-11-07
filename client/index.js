import {getWebcam, showStream} from './util/webcam';
import * as peerjs from './util/peerjs';

// local peerjs options
const PEER_OPTIONS = {
  host: location.hostname,
  port: 8080,
  path: '/peer',
};

(function () {
  var peer = new Peer(PEER_OPTIONS);

  peer.on('open', function(peerId) {
    var uri = location.origin + '/ready?peerId='+peerId;
    fetch(uri).then(function (response) {
      return response.text();
    }).then(function (dest) {
      if (dest === 'WAIT') {
        console.log('waiting...');
        return;
      }

      getWebcam().then((stream) => {
        var call = peer.call(dest, stream);
        call.on('stream', showStream);
      });
    });

    peer.on('call', function(call) {
      getWebcam().then((stream) => {
        call.answer(stream);
        call.on('stream', showStream);
      });
    });
  });
})();
