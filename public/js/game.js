navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

// there was an error with camera
var ERR_WEBCAM = new Error('cam');

// local peerjs options
var PEER_OPTIONS = {
  host: location.hostname,
  port: 8080,
  path: '/peer',
};

// url to send ready http requests
var READY_URL = location.origin + '/ready';

function withWebcam(callback) {
  navigator.getUserMedia(
    {audio: false, video: true},
    function(s) { callback(null, s) },
    function(e) { callback(e) }
  );
}

function showStream(stream) {
  var video = document.getElementById('video');
  video.src = URL.createObjectURL(stream);
  video.onloadedmetadata = function(e) { video.play() };
}

function callPeer(peer, dest) {
  withWebcam(function (err, webcam) {
    var call = peer.call(dest, webcam);
    call.on('stream', showStream);
  });
}

(function () {
  var peer = new Peer(PEER_OPTIONS);

  peer.on('open', function(peerId) {
    var uri = READY_URL + '?peerId='+peerId;
    fetch(uri).then(function (response) {
      return response.text();
    }).then(function (dest) {
      if (dest === 'WAIT') {
        return;
      }

      callPeer(peer, dest);
    });

    peer.on('call', function(call) {
      withWebcam(function (err, webcam) {
        call.answer(webcam);
        call.on('stream', showStream);
      });
    });
  });
})();
