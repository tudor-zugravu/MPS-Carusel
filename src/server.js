var express = require('express');
var app = express();
var fs = require("fs");

app.use(express.static('public'));

var FILENAME = __dirname + "/public/res/words.txt";
var wordArray = (fs.readFileSync(FILENAME, "utf8")).split('\n');

function hasWord(word) {
  var length = wordArray.length;
  for(var i = 0; i < length; i++) {
    if(wordArray[i].trim() == word) {
      return true;
    }
  }
  return false;
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/" + "index.html" );
});

app.get('/:word', function(req, res) {
  if (hasWord(req.params.word)) {
    res.send("1");
  } else {
    res.send("0");
  }
});

var server = app.listen(80, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("MPS-Carusel up and running at http://%s:%s", host, port);
})
