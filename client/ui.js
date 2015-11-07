import {startTracking} from './motion-detection/app'
import './motion-detection/sample'

export default {
  setMode(mode) {
    console.log('set-mode:', mode);
  },

  setSelfStream(stream) {
    return this.setStream('video-self', stream).then(() => {
      startTracking(stream);
      return stream;
    });
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
};
