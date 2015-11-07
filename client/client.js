import getcam from './util/getcam';
import ui from './ui';

export default class Client {
  constructor(id, peerjs, socket) {
    this.id = id;
    this.peerjs = peerjs;
    this.socket = socket;
    this.stream = null;
  }

  setupStream() {
    return getcam().then(stream => {
      ui.setSelfStream(stream);
      this.stream = stream;
      return stream;
    });
  }

  sendMsg(msg) {
    console.log('> msg:', msg);
    this.socket.send(JSON.stringify(msg));
  }

  sendReady() {
    this.sendMsg({type: 'ready'});
    ui.setMode('waiting');
  }

  requestTime(id) {
    this.sendMsg({type: 'time', id});
  }

  answerCall(call) {
    return this._answer(call, this.stream)
      .then(peerStream => ui.setPeerStream(peerStream))
      .then(() => ui.setMode('connected'));
  }

  initialeCall(id) {
    return this._call(id, this.stream)
      .then(peerStream => ui.setPeerStream(peerStream))
      .then(() => ui.setMode('connected'));
  }

  _answer(call, stream) {
    return new Promise((resolve, reject) => {
      call.answer(stream);
      call.once('stream', resolve);
    });
  }

  _call(id, stream) {
    return new Promise((resolve, reject) => {
      var call = this.peerjs.call(id, stream);
      call.once('stream', resolve);
    });
  }
}
