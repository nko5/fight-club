export default {
  setMode(mode) {
    console.log('mode:', mode);
  },

  setSelfStream(stream) {
    return this.setStream('video-self', stream);
  },

  setPeerStream(stream) {
    return this.setStream('video-peer', stream);
  },

  setStream(elementId, stream) {
    return new Promise((resolve, reject) => {
      var video = document.getElementById(elementId);
      video.src = URL.createObjectURL(stream);
      video.onloadedmetadata = (e) => {
        video.play();
        resolve(stream);
      };
    });
  },

  showAttackBell() {
    console.log('BELL!!');
  },

  showSelfAttack(type, millis, extra) {
    // if extra > 0, user has cheated
    // let him know and regret this
    console.log('ATTACK:PEER!', type);
  },

  showPeerAttack(type) {
    console.log('ATTACK:SELF!', type);
  },

  showWinMessage() {
    console.log('WIN!');
  },
};
