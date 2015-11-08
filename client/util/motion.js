window.requestAnimFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame;

export default class Motion {
  constructor(stream, handler) {
    this.stream = stream;
    this.handler = handler || Function();
    this.hotspots = {};
    this.element = document.getElementById('video-self');
    this.active = false;

    this._lastImageData;
    this._canvasSource = document.getElementById('canvas-source');
    this._contextSource = this._canvasSource.getContext('2d');
    this._canvasBlended = document.getElementById('canvas-blended');
    this._contextBlended = this._canvasBlended.getContext('2d');
  }

  start() {
    this._spots();
    this.active = true;

    const canplay = () => {
      this.element.removeEventListener('canplay', canplay);
      this.update();
    };

    this.element.addEventListener('canplay', canplay);
    this.element.src = URL.createObjectURL(this.stream);
    this.update();
  }

  stop() {
    this.active = false;
  }

  update() {
    if (!this.active) {
      return;
    }

    this._draw();
    this._blend();
    this._check();

    // update again on next frame
    requestAnimFrame(() => this.update());
  }

  _spots() {
    const elWidth = this.element.width;
    const elHeight = this.element.height;
    const width = Math.floor(elWidth * 0.1);
    const height = elHeight;
    this.hotspots.left = {width, height, y: 0, x: width};
    this.hotspots.right = {width, height, y: 0, x: elWidth - 2*width};
  }

  _draw () {
    try {
      const width = this.element.width;
  		const height = this.element.height;
			this._contextSource.drawImage(this.element, 0, 0, width, height);
		} catch (e) {
			console.error(e);
		}
  }

  _blend () {
    const width = this._canvasSource.width;
		const height = this._canvasSource.height;
		// get webcam image data
		const srcdata = this._contextSource.getImageData(0, 0, width, height);
		// create an image if the previous image doesn’t exist
    const lstdata = this._lastImageData || srcdata;
		// create a ImageData instance to receive the blended result
		var blndata = this._contextSource.createImageData(width, height);
		// blend the 2 images
		this._diff(blndata.data, srcdata.data, lstdata.data);
		// draw the result in a canvas
		this._contextBlended.putImageData(blndata, 0, 0);
		// store the current webcam image
		this._lastImageData = srcdata;
  }

  _diff(target, data1, data2) {
    if (data1.length != data2.length) {
      return null;
    }

    let i = 0;
    const max = data1.length * 0.25;

    while(i < max) {
      const avg1 = (data1[4 * i] + data1[4 * i + 1] + data1[4 * i + 2]) / 3;
      const avg2 = (data2[4 * i] + data2[4 * i + 1] + data2[4 * i + 2]) / 3;
      const diff = this._thresh(this._fabs(avg1 - avg2));
      target[4 * i] = diff;
			target[4 * i + 1] = diff;
			target[4 * i + 2] = diff;
			target[4 * i + 3] = 0xFF;
			++i;
    }
  }

  _fabs(val) {
    return (val ^ (val >> 31)) - (val >> 31);
  }

  _thresh(val) {
    return (val > 0x15) ? 0xFF : 0;
  }

  _check () {
    const now = Date.now();

    for (let spotname in this.hotspots) {
      if (!this.hotspots.hasOwnProperty(spotname)) {
        continue;
      }

      const spot = this.hotspots[spotname];
      if (now - spot.touched < 500) {
        continue;
      }

      const data = this._contextBlended.getImageData(spot.x, spot.y, spot.width, spot.height).data;

      let i = 0;
      let avg = 0;
      const max = data.length * 0.25;

      while(i < max) {
        // make an average between the color channel
				avg += (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
				++i;
      }

      if (Math.round(avg / max) > 10) {
        spot.touched = now;
        this._calc(spot);
			}
    }
  }

  _calc(me) {
    let lastSpot;
    let lastName;

    for (var spotname in this.hotspots) {
      if (!this.hotspots.hasOwnProperty(spotname)) {
        continue;
      }

      const spot = this.hotspots[spotname];
      if (spot === me) {
        continue;
      }

      if (!lastSpot) {
        lastSpot = spot;
        lastName = spotname;
        continue;
      }

      if (spot.touched > lastSpot.touched) {
        lastSpot = spot;
        lastName = spotname;
      }
    }

    if (!lastSpot || !lastSpot.touched) {
      return;
    }

    if (me.touched - lastSpot.touched < 1000) {
      this.handler(lastName);
    }
  }
}
