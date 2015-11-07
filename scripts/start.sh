#!/bin/bash

mkdir -p /tmp/transpiled
./node_modules/.bin/babel ./client -d /tmp/transpiled
./node_modules/.bin/webpack /tmp/transpiled/index.js ./public/js/bundle.js
rm -rf /tmp/transpiled
node server.js
