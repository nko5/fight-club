let waiting = null;

// TODO this is is only a temporary version
// This cna go wrong sometimes so refresh.
// I'll replace this with a better one in bg.
export function HTTPMatcher(req, res) {
  const peerId = req.query.peerId;
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
