var express = require('express');
var app = express();

//Create a static file server
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

app.listen(8080, function (err) {
  if(err) {
    throw err;
  }

  console.log('Express server started on port 8080');
});
