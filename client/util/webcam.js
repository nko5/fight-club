// attempt to use vendor prefixed getUserMedia
navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

const constrains = {
  audio: false,
  video: true,
};

export function getWebcam() {
  return new Promise((resolve, reject) => {
    navigator.getUserMedia(constrains, resolve, reject);
  });
}

export function showStream(stream) {
  var video = document.getElementById('video');
  video.src = URL.createObjectURL(stream);
  video.onloadedmetadata = function(e) { video.play() };
}
