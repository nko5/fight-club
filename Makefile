build:
	./node_modules/.bin/browserify \
		-d \
	  ./client/index.js \
	  -o ./public/js/bundle.js \
	  -t babelify \
	  --presets [ es2015 stage-0 ]

watch:
	./node_modules/.bin/nodemon \
	  -w ./server \
	  -w ./client \
	  -w ./public/index.html \
	  -w ./public/vendor \
	  -w ./public/styles \
	  -x "make start"

start: build
	node server.js
