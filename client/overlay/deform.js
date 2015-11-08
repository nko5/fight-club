var mouth_vertices = [
  [44,45,61,44],
  [45,46,61,45],
  [46,60,61,46],
  [46,47,60,46],
  [47,48,60,47],
  [48,59,60,48],
  [48,49,59,48],
  [49,50,59,49],
  [50,51,58,50],
  [51,52,58,51],
  [52,57,58,52],
  [52,53,57,52],
  [53,54,57,53],
  [54,56,57,54],
  [54,55,56,54],
  [55,44,56,55],
  [44,61,56,44],
  [61,60,56,61],
  [56,57,60,56],
  [57,59,60,57],
  [57,58,59,57],
  [50,58,59,50],
];

var extendVertices = [
  [0,71,72,0],
  [0,72,1,0],
  [1,72,73,1],
  [1,73,2,1],
  [2,73,74,2],
  [2,74,3,2],
  [3,74,75,3],
  [3,75,4,3],
  [4,75,76,4],
  [4,76,5,4],
  [5,76,77,5],
  [5,77,6,5],
  [6,77,78,6],
  [6,78,7,6],
  [7,78,79,7],
  [7,79,8,7],
  [8,79,80,8],
  [8,80,9,8],
  [9,80,81,9],
  [9,81,10,9],
  [10,81,82,10],
  [10,82,11,10],
  [11,82,83,11],
  [11,83,12,11],
  [12,83,84,12],
  [12,84,13,12],
  [13,84,85,13],
  [13,85,14,13],
  [14,85,86,14],
  [14,86,15,14],
  [15,86,87,15],
  [15,87,16,15],
  [16,87,88,16],
  [16,88,17,16],
  [17,88,89,17],
  [17,89,18,17],
  [18,89,93,18],
  [18,93,22,18],
  [22,93,21,22],
  [93,92,21,93],
  [21,92,20,21],
  [92,91,20,92],
  [20,91,19,20],
  [91,90,19,91],
  [19,90,71,19],
  [19,71,0,19]
]

const PLAYER_TO_ELEMENT = {
  peer: {
    overlay: "canvas-overlay-peer",
    element: "video-peer",
    webgl: "webgl-peer"
  },
  self: {
    overlay: "canvas-overlay-self",
    element: "video-self",
    webgl: "webgl-self"
  }
}
var presets = {
	"unwell" : [0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	"inca" : [0, 0, -9, 0, -11, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0],
	"cheery" : [0, 0, -9, 9, -11, 0, 0, 0, 0, 0, 0, 0, -9, 0, 0, 0, 0, 0],
	"dopey" : [0, 0, 0, 0, 0, 0, 0, -11, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0],
	"longface" : [0, 0, 0, 0, -15, 0, 0, -12, 0, 0, 0, 0, 0, 0, -7, 0, 0, 5],
	"lucky" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -4, 0, -6, 12, 0, 0],
	"overcute" : [0, 0, 0, 0, 16, 0, -14, 0, 0, 0, 0, 0, -7, 0, 0, 0, 0, 0],
	"aloof" : [0, 0, 0, 0, 0, 0, 0, -8, 0, 0, 0, 0, 0, 0, -2, 0, 0, 10],
	"evil" : [0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, -8],
	"artificial" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, -16, 0, 0, 0, 0, 0],
	"none" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

var phHolder = {};
var deformTypeHolder = {
  peer: "none",
  self: "none"
};
var hitsHolder = {
  peer: 0,
  self: 0
};

export function deformFace(user, deformType = "unwell", hits) {
  deformTypeHolder[user] = deformType;
  hitsHolder[user] = hits;
}

export function initDeformFace(user) {
  if(phHolder[user]){
    deformTypeHolder[user] = "none";
    hitsHolder[user] = 0;
    return ;
  }
  var vid  = document.getElementById(PLAYER_TO_ELEMENT[user].element);
  var pnums = pModel.shapeModel.eigenValues.length-2;
  var parameterHolder = function() {
  	for (var i = 0;i < pnums;i++) {
  		this['component '+(i+3)] = 0;
  	}
  	this.presets = 0;
  };

  phHolder[user] = new parameterHolder();

  var animationRequest;
  var positions;
  var ctrack = new clm.tracker();

  var overlay = document.getElementById(PLAYER_TO_ELEMENT[user].overlay);
  overlay.style.visibility = "hidden";
  var overlayCC = overlay.getContext('2d');

  // canvas for copying videoframes to
  var videocanvas = document.createElement('CANVAS');
  videocanvas.width = vid.width;
  videocanvas.height = vid.height;

  var fd = new faceDeformer();
  var webglEl = document.getElementById(PLAYER_TO_ELEMENT[user].webgl);
  fd.init(webglEl);
  var wc1 = webglEl.getContext('webgl') || webglEl.getContext('experimental-webgl')
  wc1.clearColor(0,0,0,0);

  ctrack.init(pModel);
  ctrack.start(vid);

  drawGridLoop();
  function drawGridLoop() {
    // get position of face
    positions = ctrack.getCurrentPosition(vid);

    overlayCC.clearRect(0, 0, vid.width, vid.height);
    if (positions) {
      // draw current grid
      ctrack.draw(overlay);
    }
    // check whether mask has converged
    var pn = ctrack.getConvergence();
    if (pn < 0.4) {
      drawMaskLoop();
    } else {
      requestAnimFrame(drawGridLoop);
    }
  }

  function drawMaskLoop() {
    videocanvas.getContext('2d').drawImage(vid,0,0,videocanvas.width,videocanvas.height);

    var pos = ctrack.getCurrentPosition(vid);
    // create additional points around face
    var tempPos;
    var addPos = [];
    for (var i = 0;i < 23;i++) {
      tempPos = [];
      var item = pos[i] || [];
      var item62 = pos[62] || [];
      tempPos[0] = (item[0] - item62[0])*1.3 + item62[0];
      tempPos[1] = (item[1] - item62[1])*1.3 + item62[1];
      addPos.push(tempPos);
    }
    if(typeof pos.concat !== "function"){
      animationRequest = requestAnimFrame(drawMaskLoop);
      return;
    }
    // merge with pos
    var newPos = pos.concat(addPos);

    var newVertices = pModel.path.vertices.concat(mouth_vertices);
    // merge with newVertices
    newVertices = newVertices.concat(extendVertices);

    fd.load(videocanvas, newPos, pModel, newVertices);
    // get position of face

    var parameters = ctrack.getCurrentParameters();
    var ph = phHolder[user];
    var deformType = deformTypeHolder[user];
    for (var i = 0;i < pnums;i++) {
      if(i === 6) {
        ph['component '+(i+3)] = hitsHolder[user] * 2;
      } else {
        ph['component '+(i+3)] = presets[deformType][i];
      }
    }
    for (var i = 6;i < parameters.length;i++) {
      parameters[i] += ph['component '+(i-3)];
    }

    positions = ctrack.calculatePositions(parameters);

    overlayCC.clearRect(0, 0, videocanvas.width,videocanvas.height);
    if (positions) {
      // add positions from extended boundary, unmodified
      newPos = positions.concat(addPos);
      // draw mask on top of face
      fd.draw(newPos);
    }
    animationRequest = requestAnimFrame(drawMaskLoop);
  }
}


function _deform(vid){

}
