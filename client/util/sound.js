var fightClubSounds = {};
initializeSound();

export function initializeSound(){
  let knownSounds = {
    'bell': 'bell.wav',
    'left': 'hit.mp3',
    'right': 'punch.wav',
    'win': 'win.mp3',
    'lose': 'lose.mp3',
    'ouch': 'ouch.wav',
    'crowd': 'crowd.wav'
  };

  for(let sound in knownSounds){
    fightClubSounds[sound] = new Audio('sound/' + knownSounds[sound])
  }
}

export function playSound(name){
  let sound = fightClubSounds[name]

  sound.load();
  sound.play();
}

export function stopSound(name){
  let sound = fightClubSounds[name]

  sound.pause();
}

export function loopSound(name){
  let sound = fightClubSounds[name]

  sound.load();
  sound.loop = true;
  sound.play();
}