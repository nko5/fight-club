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

  showSelfAttack(type) {
    console.log('ATTACK:PEER!', type);
  },

  showPeerAttack(type) {
    console.log('ATTACK:SELF!', type);
  },

  showWinMessage() {
    console.log('WIN!');
  },
};
