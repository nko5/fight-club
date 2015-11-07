#!/bin/bash

./node_modules/.bin/nodemon \
  -w ./server \
  -w ./client \
  -w ./public/index.html \
  -w ./public/vendor \
  -w ./public/styles \
  -x ./start.sh
