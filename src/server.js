var express = require('express');
var app = express();
var fs = require("fs");

app.use(express.static('public'));

var FILENAME = __dirname + "/public/res/words.txt";
var wordArray = (fs.readFileSync(FILENAME, "utf8")).split('\n');

/* Cine imparte parte isi face */
var highscores = [
  {
    name: "matei",
    score: 100,
  },
  {
    name: "patulea",
    score: 90,
  },
  {
    name: "florea",
    score: 80,
  }
];
var maxHighscores = 10;

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
  if (req.params.word == 'highscores') {
    highscores.splice(maxHighscores);
    var ret = "";
    for (var i = 0; i < highscores.length; i++) {
      ret += highscores[i].name + " " + highscores[i].score + "\n";
    }

    res.send(ret);
  }

  else if (req.params.word.indexOf('submit:') == 0) {
    var firstColon = req.params.word.indexOf(':');
    var secondColon = req.params.word.indexOf(':', firstColon + 1);
    var name = req.params.word.substring(firstColon + 1, secondColon);
    var score = parseInt(req.params.word.substring(secondColon + 1), 10);

    for (var i = 0; i < highscores.length; i++) {
      if (highscores[i].score < score) {
        highscores.splice(i, 0, {name: name, score: score});
        break;
      }
    }
    highscores.splice(maxHighscores);
    res.send("1");
  }

  else if (hasWord(req.params.word)) {
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
