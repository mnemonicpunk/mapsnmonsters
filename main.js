const PORT = process.env.PORT || 8000;

var express = require('express');
var app = express();
var TTServer = require('./server/ttserver.js');
require('express-ws')(app);

let ttserver = new TTServer();

app.use(express.static('client'));
app.ws('/data', function(ws, req) {
    ttserver.connectUser(ws);
});
app.listen(PORT, function () {
    console.log('Server listening on port ' + PORT + '!');
});
  