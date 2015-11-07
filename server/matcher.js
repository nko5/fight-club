var waiting = null;

function handler(req, res) {
  var peerId = req.query.peerId;
  if (!peerId) {
    res.end('ERROR');
    return;
  }

  if(!waiting) {
    waiting = peerId;
    res.end('WAIT');
    return;
  }

  res.end(waiting);
  waiting = null;
}

module.exports = {
  handler: handler,
};
