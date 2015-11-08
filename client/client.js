import getcam from './util/getcam';
import Motion from './util/motion';
import ui from './ui';

const CHEAT_THRESHOLD = 3;

export default class Client {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.peerjs = null;
    this.stream = null;
    this.motion = null;

    this._opponent = '';
    this._countActions = null;
    this._actionCount = 0;
    this._actionCallback = null;
  }

  initialize() {
    return getcam()
      .then(stream => ui.setSelfStream(stream))
      .then(stream => {
        this.stream = stream;
        this.motion = new Motion(stream, act => this._motion(act));
        return stream;
      })
      .then(() => {
        this.peerjs = new Peer(this.id, {
          host: location.hostname,
          port: location.port,
          path: '/peer',
        });

        this.peerjs.once('open', () => {
          console.log('! log: peerjs connection ready');
          this.sendReady();
        });

        this.peerjs.on('call', call => {
          console.log('! log: answered peerjs call');
          this.answerCall(call);
        });
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

  sendSchedule() {
    this.sendMsg({type: 'schedule', opponent: this._opponent});
  }

  sendRestime(millis) {
    this.sendMsg({type: 'restime', opponent: this._opponent, millis});
  }

  trackRestime(ts) {
    this.motion.start();
    var now = Date.now();
    if (now > ts) {
      console.log('! log: way past attack time');
      this._track();
    } else {
      this._countActions = true;
      console.log('! log: attack after %d ms', ts - now);
      setTimeout(() => this._track(), ts - now);
    }
  }

  answerCall(call) {
    return this._answer(call, this.stream)
      .then(peerStream => ui.setPeerStream(peerStream))
      .then(() => ui.setMode('connected'));
  }

  initiateFight(id) {
    this._opponent = id;
    return this._call(id, this.stream)
      .then(peerStream => ui.setPeerStream(peerStream))
      .then(() => ui.setMode('connected'))
      .then(() => this.sendSchedule());
  }

  _motion(act) {
    if(this._countActions) {
      this._actionCount++;
    }

    if(this._actionCallback) {
      const callback = this._actionCallback;
      this._actionCallback = null;
      callback(act);
    }
  }

  _answer(call, stream) {
    this._opponent = call.peer;
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
    ui.showAttackBell();
    let extra = 0;

    this._countActions = false;
    console.log('this._actionCount:', this._actionCount);
    if (this._actionCount > CHEAT_THRESHOLD) {
      console.log('! log: cheat detected');
      extra = 1000;
    }

    const startTime = Date.now();
    this._actionCallback = act => {
      console.log('act:', act);
      this._actionCallback = null;
      this.motion.stop();
      const millis = Date.now() - startTime;
      ui.showSelfAttack(act, millis, extra);
      this.sendRestime(millis + extra);
    };
  }
}
