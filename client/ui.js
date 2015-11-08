import {playSound, stopSound, loopSound} from './util/sound'
import {selfBang, peerBang} from './util/bang'

var UIHelper = {
  userHealth: {
    self: 100,
    peer: 100
  }
};

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

  showConnected() {
    UIHelper.userHealth.self = 100;
    UIHelper.userHealth.peer = 100;
    updateHealthBars();
    loopSound('crowd')
  },

  showAttackBell() {
    playSound('bell');
    console.log('BELL!!');
  },

  showSelfAttack(type, millis, extra) {
    // if extra > 0, user has cheated
    // let him know and regret this
    playSound('ouch');
    playSound(type);
    let x, y;
    if(type==='left'){
      x=getRandomArbitrary(55, 70);
      y=getRandomArbitrary(30, 70);
    } else {
      x=getRandomArbitrary(10, 30);
      y=getRandomArbitrary(30, 70);
    }
    const kind = getRandomInt(0, 4)

    peerBang(x, y, kind);
    console.log('ATTACK:SELF!', type);
  },

  setSelfAttackCount(n) {
    var health = ((10 - n)/10)*100;
    UIHelper.userHealth.peer = health;
    updateHealthBars();
    console.log('ATTACK:COUNT:SELF!', n);
  },

  showPeerAttack(type) {
    playSound(type);
    let x, y;
    if(type==='left'){
      x=getRandomArbitrary(55, 70);
      y=getRandomArbitrary(30, 70);
    } else {
      x=getRandomArbitrary(10, 30);
      y=getRandomArbitrary(30, 70);
    }

    const kind = getRandomInt(0, 4)

    selfBang(x, y, kind);
    console.log('ATTACK:PEER!', type);
  },

  setPeerAttackCount(n) {
    var health = ((10 - n)/10)*100;
    UIHelper.userHealth.self = health;
    updateHealthBars();
    console.log('ATTACK:COUNT:PEER!', n);
  },

  showWinMessage() {
    stopSound('crowd');
    playSound('win');
    console.log('WIN!');
  },

  showLoseMessage() {
    stopSound('crowd');
    playSound('lose');
    console.log('LOSE!');
  },

  showNextRound(round) {
    console.log('ROUND %d', round);
  }
};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function updateHealthBars() {
  var selfHealth = UIHelper.userHealth.self;
  var peerHealth = UIHelper.userHealth.peer;

  $('.health-bar-self').css('width', selfHealth+'%');
  $('.health-bar-self-text').text(selfHealth);

  $('.health-bar-peer').css('width', peerHealth+'%');
  $('.health-bar-peer-text').text(peerHealth);
}
