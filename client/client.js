import {startTracking} from './motion-detection/app'
import './motion-detection/sample'
import getcam from './util/getcam';
import ui from './ui';

const CHEAT_THRESHOLD = 3;

export default class Client {
  constructor(id, peerjs, socket) {
    this.id = id;
    this.peerjs = peerjs;
    this.socket = socket;
    this.stream = null;

    this._countActions = null;
    this._actionCount = 0;
    this._actionCallback = null;
  }

  setupStream() {
    return getcam()
      .then(stream => ui.setSelfStream(stream))
      .then(stream => {
        this.stream = stream;
        this.startTracking();
        return stream;
      })
  }

  sendMsg(msg) {
    console.log('> msg:', msg);
    this.socket.send(JSON.stringify(msg));
  }

  sendReady() {
    this.sendMsg({type: 'ready'});
    ui.setMode('waiting');
  }

  sendSchedule(id) {
    this.sendMsg({type: 'schedule', opponent: id});
  }

  requestTime(id) {
    this.sendMsg({type: 'time', id});
  }

  startTracking() {
    startTracking(this.stream, () => {
      console.log('arguments:', arguments);
    });
  }

  trackRestime(ts) {
    var now = Date.now();
    if (now > ts) {
      this._track();
    } else {
      this._countActions = true;
      setTimeout(() => this._track(), now - ts);
    }
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

  _track() {
    this._countActions = false;
    console.log('this._actionCount:', this._actionCount);
    if (this._actionCount > CHEAT_THRESHOLD) {
      console.log('CHEAT!!');
      return;
    }

    this._actionCallback = act => {
      this._actionCallback = null;
      console.log('act:', act);
    };
  }
}
