import getcam from './util/getcam';
import Motion from './util/motion';
import ui from './ui';

const CHEAT_THRESHOLD = 3;

export default class Client {
  constructor(id, socket) {
    this.id = id;
    this.round = 1;
    this.socket = socket;
    this.peerjs = null;
    this.stream = null;
    this.motion = null;
    this.isCaller = false;

    this._opponent = null;
    this._complete = null;
    this._mediaConn = null;
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
        console.log('! log: starting new game');
        this.peerjs = new Peer(this.id, {
          host: location.hostname,
          port: location.port,
          path: '/peer',
          config: {iceServers: window.iceServers},
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
    this._opponent = null;
    this.sendMsg({type: 'ready'});
    ui.setMode('waiting');
  }

  sendSchedule() {
    this.sendMsg({type: 'schedule', opponent: this._opponent});
  }

  sendRestime(millis) {
    this.sendMsg({type: 'restime', opponent: this._opponent, millis});
  }

  sendAttackCount(act, count) {
    this.sendMsg({type: 'attack', opponent: this._opponent, act, count});
  }

  trackRestime(ts) {
    this.motion.start();
    var now = Date.now();
    this._countActions = true;

    if (now > ts) {
      console.log('! log: way past attack time');
      this._track();
    } else {
      console.log('! log: attack after %d ms', ts - now);
      setTimeout(() => this._track(), ts - now);
    }
  }

  stopTracking() {
    this._actionCount = 0;
    this._countActions = false;
    this._actionCallback = null;
    this.motion.stop();
  }

  answerCall(call) {
    return this._answer(call, this.stream)
      .then(peerStream => ui.setPeerStream(peerStream))
      .then(() => ui.showConnected());
  }

  initiateFight(id) {
    this.isCaller = true;
    this._opponent = id;
    return this._call(id, this.stream)
      .then(peerStream => ui.setPeerStream(peerStream))
      .then(() => ui.showConnected())
      .then(() => this.sendSchedule());
  }

  updateDamage(act, count) {
    ui.showPeerAttack(act);
    ui.setPeerAttackCount(count);
  }

  checkDisconnect() {
    if (!this._complete) {
      console.log('! log: opponent disconnected');
      this.stopTracking();
      ui.showWinMessage();
      this.sendReady();
    }
  }

  _motion(act) {
    if(this._countActions) {
      this._actionCount++;
    }

    if(this._actionCallback) {
      this._actionCallback(act);
    }
  }

  _answer(call, stream) {
    if (this._mediaConn) {
      this._complete = true;
      this._mediaConn.close();
    }

    this._mediaConn = call;
    this._opponent = call.peer;
    return new Promise((resolve, reject) => {
      call.answer(stream);
      call.once('stream', resolve);

      this._complete = false;
      call.once('close', () => this.checkDisconnect());
    });
  }

  _call(id, stream) {
    return new Promise((resolve, reject) => {
      var call = this.peerjs.call(id, stream);
      if (this._mediaConn) {
        this._complete = true;
        this._mediaConn.close();
      }

      this._mediaConn = call;
      call.once('stream', resolve);

      this._complete = false;
      call.once('close', () => this.checkDisconnect());
    });
  }

  _track() {
    ui.showAttackBell();
    let extra = 0;

    // this._countActions = false;
    if (this._actionCount > CHEAT_THRESHOLD) {
      console.log('! log: cheat detected');
      extra = 3000;
    }

    this._actionCount = 0;
    const startTime = Date.now();
    this._actionCallback = act => {
      ui.showSelfAttack(act, millis, extra);
      ui.setSelfAttackCount(this._actionCount);
      console.log('! hit:', act, this._actionCount);
      this.sendAttackCount(act, this._actionCount);

      if (this._actionCount < 10) {
        return;
      }

      this._complete = true;
      this._actionCount = 0;
      this._actionCallback = null;
      this.motion.stop();
      const millis = Date.now() - startTime;
      this.sendRestime(millis + extra);
    };
  }
}
