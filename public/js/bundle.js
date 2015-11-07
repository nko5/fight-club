/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _webcam = __webpack_require__(1);

	var _peerjs = __webpack_require__(2);

	var peerjs = _interopRequireWildcard(_peerjs);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// local peerjs options
	var PEER_OPTIONS = {
	  host: location.hostname,
	  port: 8080,
	  path: '/peer'
	};

	(function () {
	  var peer = new Peer(PEER_OPTIONS);

	  peer.on('open', function (peerId) {
	    var uri = location.origin + '/ready?peerId=' + peerId;
	    fetch(uri).then(function (response) {
	      return response.text();
	    }).then(function (dest) {
	      if (dest === 'WAIT') {
	        console.log('waiting...');
	        return;
	      }

	      (0, _webcam.getWebcam)().then(function (stream) {
	        var call = peer.call(dest, stream);
	        call.on('stream', _webcam.showStream);
	      });
	    });

	    peer.on('call', function (call) {
	      (0, _webcam.getWebcam)().then(function (stream) {
	        call.answer(stream);
	        call.on('stream', _webcam.showStream);
	      });
	    });
	  });
	})();

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getWebcam = getWebcam;
	exports.showStream = showStream;
	// attempt to use vendor prefixed getUserMedia
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	var constrains = {
	  audio: false,
	  video: true
	};

	function getWebcam() {
	  return new Promise(function (resolve, reject) {
	    navigator.getUserMedia(constrains, resolve, reject);
	  });
	}

	function showStream(stream) {
	  var video = document.getElementById('video');
	  video.src = URL.createObjectURL(stream);
	  video.onloadedmetadata = function (e) {
	    video.play();
	  };
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

/***/ }
/******/ ]);