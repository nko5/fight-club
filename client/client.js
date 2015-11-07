import {getWebcam, showStream} from './util/webcam';

export default class Client {
  constructor(id, peer, socket) {
    this.id = null;
    this.peer = null;
    this.socket = socket;
  }

  sendMsg(msg) {
    console.log('> msg:', msg);
    this.socket.send(JSON.stringify(msg));
  }

  sendReady() {
    client.sendMsg({type: 'ready'});
  }

  answerCall(call) {
    getWebcam().then(stream => {
      call.answer(stream);
      call.once('stream', showStream);
    });
  }

  startMatch(id) {
    getWebcam().then(stream => {
      var call = client.peer.call(id, stream);
      call.once('stream', showStream);
    });
  }
}
