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
}
