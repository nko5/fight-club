import express from 'express';
import {ExpressPeerServer} from 'peer';
import {HTTPMatcher} from './matcher.js';

const app = express();
app.use(express.static('public'));
app.use('/ready', HTTPMatcher);

const server = app.listen(8080, function (err) {
  if (err) {
    throw err;
  }

  console.log('listening:', 8080);
});

app.use('/peer', ExpressPeerServer(server));
