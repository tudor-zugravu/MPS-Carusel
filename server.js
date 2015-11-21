/*** REQUIRES ****************************************************************/

var express = require('express');
var fs = require("fs");

/*****************************************************************************/



/*** VARIABLES ***************************************************************/

var RomanianWords = __dirname + "/public/res/words.txt";
var wordArray = (fs.readFileSync(RomanianWords, "utf8")).split('\n');

var highscores = [];    /* Array that contains maxHighscores value with
                         * name and score. */
var maxHighscores = 10; /* Maximum number of highscores */

/*****************************************************************************/



/*** SERVER BEHAVIOUR ********************************************************/

var app = express();
app.use(express.static('public'));

app.set('port', (process.env.PORT || 5000));

/* Main page */
app.get('/', function(req, res) {
  res.sendFile(__dirname + "/" + "index.html" );
});

/* GET */
app.get('/:word', function(req, res) {
  /* Get highscores */
  if (req.params.word == 'highscores') {
    highscores.splice(maxHighscores);
    var ret = "";
    for (var i = 0; i < highscores.length; i++) {
      ret += highscores[i].name + " " + highscores[i].score + "\n";
    }

    res.send(ret);
  }

  /* Submit highscore. The word has this form: submit:name:score */
  else if (req.params.word.indexOf('submit:') == 0) {
    var firstColon = req.params.word.indexOf(':');
    var secondColon = req.params.word.indexOf(':', firstColon + 1);
    var name = req.params.word.substring(firstColon + 1, secondColon);
    var score = parseInt(req.params.word.substring(secondColon + 1), 10);

    var highscoreInMiddle = false;
    for (var i = 0; i < highscores.length; i++) {
      if (highscores[i].score < score) {
        highscores.splice(i, 0, {name: name, score: score});
        highscoreInMiddle = true;
        break;
      }
    }
    if (highscoreInMiddle == false) {
      highscores.push({name: name, score: score});
    }
    highscores.splice(maxHighscores);

    res.send("1");
  }

  /* Check word */
  else if (isAValidRomanianWord(req.params.word)) {
    res.send("1");
  } else {
    res.send("0");
  }
});

var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Server is up and running at http://%s:%s", host, port);
})

/*****************************************************************************/



/*** FUNCTIONS ***************************************************************/

/* Test if word is a valid Romanian word. */
function isAValidRomanianWord(word) {
  var length = wordArray.length;
  for (var i = 0; i < length; i++) {
    if (wordArray[i].trim().toLowerCase() == word) {
      return true;
    }
  }
  return false;
}

/*****************************************************************************/
