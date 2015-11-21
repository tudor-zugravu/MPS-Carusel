/*** VARIABLES ***************************************************************/

var dice_input = [
    "AAUIHJ", /* 0 */
    "TRNSMB", /* 1 */
    "AARCDM", /* 2 */
    "EEIODF", /* 3 */
    "ARUSFV", /* 4 */
    "TLNPGC", /* 5 */
    "AIOEXZ", /* 6 */
    "NSTRGB", /* 7 */
    "IIUELP"  /* 8 */
];

var diacritice = {
    'Ă' : 'A',
    'Â' : 'A',
    'Î' : 'I',
    'Ț' : 'T',
    'Ș' : 'S'
};

var letters;
var usedIndices = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var score = 0;
var timer = 60;
var usedWords = [];
var myVar;

var notificationDelay = 2000;

/*****************************************************************************/



/*** DOCUMENT READY **********************************************************/

$(document).ready(function() {
    $('#wordInput').focus();

    setLetters();
    setWordInputBehaviour();
    setButtonBehaviour();

    myVar = setInterval(function(){ updateTimer() }, 1000);
});

/*****************************************************************************/



/*** FUNCTIONS ***************************************************************/

function updateTimer() {
    $('#Timer').html("Timer: " + timer.toString());

    if (timer == 0) {
        document.getElementById('no').style.visibility = 'hidden';

        var dialog = document.getElementById('window');
        dialog.showModal();
        document.getElementById('yes').onclick = function() {
            location.reload();
            dialog.close();
        };

        clearTimeout(myVar);
    } else {
        timer = timer - 1;
    }
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
        /* Backspace */
        if (e.keyCode == 8) {
            var word = $('#wordInput').val().toUpperCase();
            if (word.length >= 1) {
                var deletedLetter = word.slice(-1);

                deletedLetter = deletedLetter in diacritice ? diacritice[deletedLetter] : deletedLetter;

                var indexOfDeletedLetter = letters.indexOf(deletedLetter);
                while (usedIndices[indexOfDeletedLetter] == 0) {
                    indexOfDeletedLetter = letters.indexOf(deletedLetter, indexOfDeletedLetter + 1);
                }
                if (indexOfDeletedLetter > -1) {
                    $('#letter' + indexOfDeletedLetter).css({'background-color': 'white'});
                    usedIndices[indexOfDeletedLetter] = 0;
                }
            }
        }
    });

    $('#wordInput').keypress(function(e) {
        /* On enter pressed */
        if (e.keyCode == 13) {
            var word = $('#wordInput').val().toUpperCase();

            /* Too short / long word */
            if (word.length < 4 || word.length > 9) {
                /* Clear */
                for (i = 0; i < 9; i++) {
                    usedIndices[i] = 0;
                    $('#letter' + i).css({'background-color': 'white'});
                }
                $('#wordInput').val('');

                return true;
            }

            /* Already used word */
            if (usedWords.indexOf(word) != -1) {
                $('#wordInput').css({'background-color': 'red'});
                setTimeout(function() {
                    $('#wordInput').css({'background-color': 'white'});
                }, 500);

                /* Clear */
                for (i = 0; i < 9; i++) {
                    usedIndices[i] = 0;
                    $('#letter' + i).css({'background-color': 'white'});
                }
                $('#wordInput').val('');

                return true;
            }

            /* Ask server for validation */
            $.get("/" + word.toLowerCase(), function(data) {
                /* Valid */
                if (data == "1") {
                    new PNotify({
                        title: 'Congrats',
                        text: 'Correct word',
                        type: 'success',
                        animate_speed: 'fast',
                        hide: true,
                        delay: notificationDelay
                    });

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
                    new PNotify({
                        title: 'Oh no!',
                        text: 'Incorrect word',
                        type: 'error',
                        animate_speed: 'fast',
                        hide: true,
                        delay: notificationDelay
                    });

                    $('#wordInput').css({'background-color': 'red'});
                    setTimeout(function() {
                        $('#wordInput').css({'background-color': 'white'});
                    }, 500)
                }

                /* Clear */
                for (i = 0; i < 9; i++) {
                    usedIndices[i] = 0;
                    $('#letter' + i).css({'background-color': 'white'});
                }
                $('#wordInput').val('');
            });
        }

        /* On normal key pressed */
        else {
            var lastLetter = String.fromCharCode(e.keyCode).toUpperCase();

            /* Update letter if diacritice */
            lastLetter = lastLetter in diacritice ? diacritice[lastLetter] : lastLetter;

            /* Valid letter */
            var indexOfLastLetter = letters.indexOf(lastLetter);
            while (usedIndices[indexOfLastLetter] == 1) {
                indexOfLastLetter = letters.indexOf(lastLetter, indexOfLastLetter + 1);
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
        dialog.showModal();
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
