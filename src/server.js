var express = require('express');
var app = express();
var fs = require("fs");

var FILENAME = "/home/alex/MPS/MPS-Carusel/res/loc-reduse-5.0.txt"
var wordArray = (fs.readFileSync(FILENAME, "utf8")).split('\n');

function hasWord(word) {
    var length = wordArray.length;
    console.log(word);
    for(var i = 0; i < length; i++) {
        //console.log(wordArray[i]);
        if(wordArray[i].trim() == word) {
            console.log("l-am gasit");
            return true;
        }
    }
    return false;
}

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
});

app.get('/:word', function (req, res) {
  console.log(req.params.word);
  // process
  res.send('valid');
});

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("MPS-Carusel up and running at http://%s:%s", host, port);
})
