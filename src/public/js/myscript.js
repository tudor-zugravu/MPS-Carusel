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
var timerInterval;
var notificationDelay = 2000;

/*****************************************************************************/



/*** DOCUMENT READY **********************************************************/

$(document).ready(function() {
    $('#wordInput').focus();

    setLetters();
    setWordInputBehaviour();
    setButtonBehaviour();

    timerInterval = setInterval(function(){ updateTimer() }, 1000);

    $.get("/highscores", function(data) {
        var scores = data.split('\n');

        for (var i = 0; i < scores.length; i++) {
            $('<div>').text(scores[i]).prepend($('<em/>').text('')).appendTo($('#highscore'));
            $('#highscore')[0].scrollTop = $('#highscore')[0].scrollHeight;
        }

    });
});

/*****************************************************************************/



/*** FUNCTIONS ***************************************************************/

function updateTimer() {
    $('#Timer').html("Timer: " + timer.toString());

    if (timer == 0) {
        clearTimeout(timerInterval);

        var dialog = document.getElementById('submitScore');
        dialog.showModal();
        $('#name').focus();
        document.getElementById('submit').onclick = function() {
            var name = $('#name').val();

            if (name.length < 3) {
                new PNotify({
                    title: 'Oh no',
                    text: "Your name must have at least 3 characters",
                    type: 'error',
                    animate_speed: 'fast',
                    hide: true,
                    delay: notificationDelay
                });
            } else {
                $.get("/submit:" + name + ":" + '2', function(data) {});

                new PNotify({
                    title: 'Congrats',
                    text: "Your score has been submitted",
                    type: 'success',
                    animate_speed: 'fast',
                    hide: true,
                    delay: notificationDelay
                });

                setTimeout(function() {
                    location.reload();
                    dialog.close();
                }, 1000);
            }
        };

        document.getElementById('nosubmit').onclick = function() {
            location.reload();
            dialog.close();
        };

        $('#name').keypress(function(e) {
            /* On enter pressed */
            if (e.keyCode == 13) {
                $("#submit").click();
            }
        });
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
            if (word.length < 4) {
                new PNotify({
                    title: 'Oh no',
                    text: 'At least 4 letters required',
                    type: 'error',
                    animate_speed: 'fast',
                    hide: true,
                    delay: notificationDelay
                });

                return true;
            }

            /* Already used word */
            if (usedWords.indexOf(word) != -1) {
                new PNotify({
                    title: 'Oh no',
                    text: 'You have already used this word',
                    type: 'error',
                    animate_speed: 'fast',
                    hide: true,
                    delay: notificationDelay
                });

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
                new PNotify({
                    title: 'Oh no',
                    text: "You can't use this letter",
                    type: 'error',
                    animate_speed: 'fast',
                    hide: true,
                    delay: notificationDelay
                });

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
