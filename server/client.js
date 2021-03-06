import uuid from 'node-uuid';

export default class Client {
  constructor(socket) {
    this.id = uuid.v4();
    this.socket = socket;
  }

  sendMsg(msg) {
    console.log('> msg:', msg);
    this.socket.send(JSON.stringify(msg));
  }

  sendMatch(id) {
    this.sendMsg({type: 'match', id});
  }

  sendTime(ts) {
    this.sendMsg({type: 'time', ts});
  }

  sendResult(id) {
    this.sendMsg({type: 'result', id});
  }

  sendDamage(act, count) {
    this.sendMsg({type: 'damage', act, count});
  }
}
