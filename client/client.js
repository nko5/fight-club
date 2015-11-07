export default class Client {
  constructor(socket) {
    this.id = null;
    this.peer = null;
    this.socket = socket;
  }

  sendMsg(msg) {
    console.log('> msg:', msg);
    this.socket.send(JSON.stringify(msg));
  }
}
