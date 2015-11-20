var fs = require("fs");

var FILENAME = __dirname + "/loc-baza-5.0.txt";
var wordArray = (fs.readFileSync(FILENAME, "utf8")).split('\n');

var newVals = [];
for (var i = 0; i < wordArray.length; i++) {
  var word = wordArray[i].slice(0, wordArray[i].indexOf(' ')).replace('\'','');
  if (word.length >= 4 && word.length <= 9) {
    newVals.push(word + '\n');
  }
}

fs.appendFile('words.txt', newVals.join(''), function (err) {
  console.log(err);
});
