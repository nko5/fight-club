// attempt to use vendor prefixed getUserMedia
navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

// wrap getUserMedia
export default function () {
  return new Promise((resolve, reject) => {
    const constrains = {audio: false, video: true};
    navigator.getUserMedia(constrains, resolve, reject);
  });
}
