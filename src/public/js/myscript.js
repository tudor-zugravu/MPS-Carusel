/*** VARIABLES ***************************************************************/

var dice_input = [
    "AAUIHJ", /* 0 */
    "TRNSMB", /* 1 */
    "AARCDM", /* 2 */
    "EEIODF", /* 3 */
    "AEUSFV", /* 4 */
    "TLNPGC", /* 5 */
    "AIOEXZ", /* 6 */
    "NSTRGB", /* 7 */
    "IIUELP"  /* 8 */
];

var letters;
var usedIndices = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var score = 0;
var usedWords = [];

/*****************************************************************************/



/*** DOCUMENT READY **********************************************************/



$(document).ready(function() {
    setLetters();
    setWordInputBehaviour();
    var myVar = setInterval(function(){ myTimer() }, 1000);

});

/*****************************************************************************/



/*** FUNCTIONS ***************************************************************/

var timer = 60;


function myTimer() {
    $('#Timer').html("Timer: " + timer.toString());
    
    if (timer == 0) {
        timer = 0;
        var dialog = document.getElementById('window');
        dialog.show();
        document.getElementById('no').onclick = function() {
            dialog.close();
        };

        document.getElementById('yes').onclick = function() {
            location.reload();
            dialog.close();
        };
    }
    timer = timer - 1;
}

/* Set letters values */
function setLetters() {
    letters = "";
    for (i = 0; i < 9; i++) {
        var letter = dice_input[i].charAt(Math.floor(Math.random() * 6));
        $('#letter' + i).html(letter);
        letters += letter;
    }
}


/* Set behaviour of word input */
function setWordInputBehaviour() {
     
    $('#wordInput').keydown(function(e) {
        if (e.keyCode == 8) {
            var word = $('#wordInput').val().toLowerCase();
            if (word.length >= 1) {
                var deletedLetter = word.slice(-1);

                var indexOfDeletedLetter = letters.toLowerCase().indexOf(deletedLetter);
                while (usedIndices[indexOfDeletedLetter] == 0) {
                    indexOfDeletedLetter = letters.toLowerCase().indexOf(deletedLetter,
                                                                         indexOfDeletedLetter + 1);
                }
                if (indexOfDeletedLetter > -1) {
                    $('#letter' + indexOfDeletedLetter).css({'background-color': 'gray'});
                    usedIndices[indexOfDeletedLetter] = 0;
                }
            }
        }
    });

    $('#wordInput').keypress(function(e) {
        /* On enter pressed */
        if (e.keyCode == 13) {
            var word = $('#wordInput').val().toLowerCase();

            /* Already used word */
            if (usedWords.indexOf(word) != -1) {
                $('#wordInput').css({'background-color': 'red'});
                setTimeout(function() {
                    $('#wordInput').css({'background-color': 'white'});
                }, 500);

                /* Clear */
                for (i = 0; i < 9; i++) {
                    usedIndices[i] = 0;
                    $('#letter' + i).css({'background-color': 'gray'});
                }
                $('#wordInput').val('');

                return true;
            }

            /* Ask server for validation */
            $.get("/" + word, function(data) {
                /* Valid */
                if (data == "1") {
                    score = score + 1;
                    timer = timer + 10;
                    $('#Score').html("Score: " + score.toString());

                    $('#wordInput').css({'background-color': 'green'});
                    setTimeout(function() {
                        $('#wordInput').css({'background-color': 'white'});
                    }, 500);

                    $('<div>').text(word).prepend($('<em/>').text('')).appendTo($('#ownWordsDiv'));
                    $('#ownWordsDiv')[0].scrollTop = $('#ownWordsDiv')[0].scrollHeight;

                    usedWords.push(word);
                }

                /* Invalid */
                else {
                    $('#wordInput').css({'background-color': 'red'});
                    setTimeout(function() {
                        $('#wordInput').css({'background-color': 'white'});
                    }, 500)
                }

                /* Clear */
                for (i = 0; i < 9; i++) {
                    usedIndices[i] = 0;
                    $('#letter' + i).css({'background-color': 'gray'});
                }
                $('#wordInput').val('');
            });
        }

        /* On normal key pressed */
        else {
            var lastLetter = String.fromCharCode(e.keyCode).toLowerCase();

            /* Valid letter */
            var indexOfLastLetter = letters.toLowerCase().indexOf(lastLetter);
            while (usedIndices[indexOfLastLetter] == 1) {
                indexOfLastLetter = letters.toLowerCase().indexOf(lastLetter, indexOfLastLetter + 1);
            }
            if (indexOfLastLetter > -1) {
                $('#letter' + indexOfLastLetter).css({'background-color': 'red'});
                usedIndices[indexOfLastLetter] = 1;
            } else {
                return false;
            }
        }
    });
}


function setButtonBehaviour() {
    $('#startNew').click(function () {
        var dialog = document.getElementById('window');
        dialog.show();
        document.getElementById('no').onclick = function() {
            dialog.close();
        };

        document.getElementById('yes').onclick = function() {
            location.reload();
            dialog.close();
        };
    });
}

/*****************************************************************************/
