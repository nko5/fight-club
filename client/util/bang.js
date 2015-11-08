const selfbs = [$('#self-bang'), $('#self-kaboom'), $('#self-bam'), $('#self-boom')];
const peerbs = [$('#peer-bang'), $('#peer-kaboom'), $('#peer-bam'), $('#peer-boom')];

console.log(selfbs);
console.log(peerbs);

export function selfBang(x, y, type){
  let selfb = selfbs[type];
  selfb.css({
     'left' : x+'%',
     'top' : y+'%'
   });
  selfb.show();
  setTimeout(function(){
    selfb.hide();
  }, 500)
}

export function peerBang(x, y, type){
  let peerb = peerbs[type];
  peerb.css({
     'left' : x+'%',
     'top' : y+'%'
   });
  peerb.show();
  setTimeout(function(){
    peerb.hide();
  }, 500)
}