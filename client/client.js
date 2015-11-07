import getcam from './util/getcam';
import ui from './ui';

export default class Client {
  constructor(id, peer, socket) {
    this.id = id;
    this.peer = peer;
    this.socket = socket;
  }

  sendMsg(msg) {
    console.log('> msg:', msg);
    this.socket.send(JSON.stringify(msg));
  }

  sendReady() {
    this.sendMsg({type: 'ready'});
    ui.setMode('waiting');
  }

  answerCall(call) {
    getcam().then(selfStream => {
      ui.setSelfStream(selfStream)
      call.answer(selfStream);
      call.once('stream', peerStream => {
        ui.setPeerStream(peerStream);
        ui.setMode('connected');
      });
    });
  }

  callPeer(id) {
    getcam().then(selfStream => {
      ui.setSelfStream(selfStream)
      var call = this.peer.call(id, selfStream);
      call.once('stream', peerStream => {
        ui.setPeerStream(peerStream);
        ui.setMode('connected');
      });
    });
  }
}
