let waiting = null;

export default {
  remove(clientId) {
    if (waiting === clientId) {
      waiting = null;
    }
  },

  getWaiting() {
    return waiting;
  },

  setWaiting(clientId) {
    waiting = clientId;
  },
}
