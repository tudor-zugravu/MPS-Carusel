var express = require('express');
var firebase = require('firebase');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/:id', function(req, res) {
  var id = req.params.id;
  console.log(id);
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})
