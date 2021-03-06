/*** VARIABLES ***************************************************************/

/* Frequency rank law for letters in Romanian */
var letter_freq_rank = {
    "A" : 14.92, /* A + Ă + Â*/
    "E" : 11.47,
    "I" : 11.36, /* I + Î */
    "T" : 7.04,  /* T + Ț */
    "R" : 6.82,
    "N" : 6.47,
    "U" : 6.20,
    "S" : 5.95,  /* S + Ș */
    "C" : 5.28,
    "L" : 4.48,
    "O" : 4.07,
    "D" : 3.45,
    "P" : 3.18,
    "M" : 3.10,
    "V" : 1.23,
    "F" : 1.18,
    "B" : 1.07,
    "G" : 0.99,
    "Z" : 0.71,
    "H" : 0.47,
    "J" : 0.24,
    "X" : 0.11,
    "K" : 0.11,
    "Y" : 0.07,
    "W" : 0.03
}

/* Romanian diacritical. This object is used in order to allow the usage of
 * a normal letter as every corresponsing diacritical. For example, the letter
 * A can be used as both Ă or Â. */
var diacritical = {
    'Ă' : 'A',
    'Â' : 'A',
    'Î' : 'I',
    'Ț' : 'T',
    'Ș' : 'S'
};

var letters = ""; /* Values of the 9 available letters.
                   * This var is to be updated in setLetters method. */

var score = 0; /* Score. This value is increased by one with every correct
                * word. */

var timer = 60; /* Timer value. This value in decremented by one every
                 * second. */

var timerInterval; /* Time update interval. */

var usedWords = []; /* Array with used words. */

var notificationDelay = 2000; /* How much time in milliseconds the
                               * notifications are displayed. */

var usedIndices = [0, 0, 0, 0, 0, 0, 0, 0, 0]; /* Array with 9 values used to
                                                * mark the used used letters */

var validationInProgress = false; /* Used to block the validation of a word
                                   * until the last word is validated. */

/*****************************************************************************/



/*** DOCUMENT READY **********************************************************/

$(document).ready(function() {
    /* Focus the word input area when the document is ready. */
    $('#wordInput').focus();

    setLetters();
    setWordInputBehaviour();
    setStartNewGameButtonBehaviour();

    timerInterval = setInterval(function(){ updateTimer() }, 1000);

    /* Get highscores and display them in the hall of fame. */
    $.get("/highscores", function(data) {
        var scores = data.split('\n');

        for (var i = 0; i < scores.length; i++) {
            $('<div>').text(scores[i]).prepend($('<em/>').text('')).
                appendTo($('#highscore'));
            $('#highscore')[0].scrollTop = $('#highscore')[0].scrollHeight;
        }
    });
});

/*****************************************************************************/



/*** FUNCTIONS ***************************************************************/

function updateTimer() {
    /* Update timer view. */
    $('#Timer').html("Timer: " + timer.toString());

    /* End of game */
    if (timer == 0) {
        clearTimeout(timerInterval);

        var dialog = document.getElementById('submitScore');
        dialog.showModal();

        /* Focus on name input */
        $('#name').focus();

        /* Submit behaviour */
        document.getElementById('submit').onclick = function() {
            var name = $('#name').val();

            /* Don't allow names with less than 3 characters */
            if (name.length < 3) {
                new PNotify({
                    title: 'Oh No!',
                    text: "Your name must have at least 3 characters",
                    type: 'error',
                    animate_speed: 'fast',
                    hide: true,
                    delay: notificationDelay
                });
            }

            /* Submit highscore */
            else {
                $.get("/submit:" + name + ":" + score, function(data) {});

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

        /* Enter on name input has the same behaviour as the submit button */
        $('#name').keypress(function(e) {
            if (e.keyCode == 13) {
                $("#submit").click();
            }
        });
    }

    /* Update timer */
    else {
        timer = timer - 1;
    }
}


/* Set letters values. Every letter gets a random value from its seed. */
function setLetters() {
    /* Build probability */
    var last_key = null;
    for (var i in letter_freq_rank) {
        if (last_key != null) {
            letter_freq_rank[i] += letter_freq_rank[last_key];
        }
        last_key = i;
    }

    /* Choose letter */
    var letter = 'Z';
    for (var i = 0; i < 9; i++) {
        var rand = Math.floor(Math.random() * 100);
        console.log(rand);

        for (var j in letter_freq_rank) {
            console.log(letter_freq_rank[j])
            if (rand < letter_freq_rank[j]) {
                letter = j;
                break;
            }
        }

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
            /* Look for deleted letter and mark it as unused */
            if (word.length >= 1) {
                var deletedLetter = word[this.selectionStart - 1];

                /* Convert diacritical to corresponding value. */
                deletedLetter = deletedLetter in diacritical ?
                    diacritical[deletedLetter] : deletedLetter;

                /* Look in all letters as there might be more letters with the
                 * same value. */
                var indexOfDeletedLetter = letters.indexOf(deletedLetter);
                while (usedIndices[indexOfDeletedLetter] == 0) {
                    indexOfDeletedLetter = letters.indexOf(deletedLetter,
                        indexOfDeletedLetter + 1);
                }
                if (indexOfDeletedLetter > -1) {
                    $('#letter' + indexOfDeletedLetter).css(
                        {'background-color': 'white'});
                    usedIndices[indexOfDeletedLetter] = 0;
                }
            }
        }
    });

    $('#wordInput').keypress(function(e) {
        /* On enter pressed */
        if (e.keyCode == 13) {
            if (validationInProgress ==  true) {
                new PNotify({
                    title: 'Info',
                    text: "I'm still validating your last word",
                    type: 'info',
                    animate_speed: 'fast',
                    hide: true,
                    delay: notificationDelay
                });

                return true;
            }

            var word = $('#wordInput').val().toUpperCase();

            /* Word is too short */
            if (word.length < 4) {
                new PNotify({
                    title: 'Oh No!',
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
                    title: 'Oh No!',
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

            validationInProgress = true;

            /* Ask server for validation */
            $.get("/" + word.toLowerCase(), function(data) {
                /* Valid word */
                if (data == "1") {
                    new PNotify({
                        title: 'Congrats',
                        text: 'Correct word',
                        type: 'success',
                        animate_speed: 'fast',
                        hide: true,
                        delay: notificationDelay
                    });

                    /* Update score and time */
                    timer = timer + 10;
                    score = score + 1;
                    $('#Score').html("Score: " + score.toString());

                    $('#wordInput').css({'background-color': 'green'});
                    setTimeout(function() {
                        $('#wordInput').css({'background-color': 'white'});
                    }, 500);

                    $('<div>').text(word).prepend($('<em/>').text(''))
                        .appendTo($('#ownWordsDiv'));
                    $('#ownWordsDiv')[0].scrollTop = $('#ownWordsDiv')[0]
                        .scrollHeight;

                    usedWords.push(word);
                }

                /* Invalid word */
                else {
                    new PNotify({
                        title: 'Oh No!!',
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

                validationInProgress = false;
            });
        }

        /* On normal key pressed */
        else {
            var lastLetter = String.fromCharCode(e.keyCode).toUpperCase();

            /* Update letter if diacritical */
            lastLetter = lastLetter in diacritical ?
                diacritical[lastLetter] : lastLetter;

            /* Look in all letters as there might be more letters with the
             * same value. */
            var indexOfLastLetter = letters.indexOf(lastLetter);
            while (usedIndices[indexOfLastLetter] == 1) {
                indexOfLastLetter = letters.indexOf(lastLetter,
                    indexOfLastLetter + 1);
            }

            /* Valid letter */
            if (indexOfLastLetter > -1) {
                $('#letter' + indexOfLastLetter).css(
                    {'background-color': 'red'});
                usedIndices[indexOfLastLetter] = 1;
            }

            /* Invalid letter */
            else {
                new PNotify({
                    title: 'Oh No!',
                    text: "You can't use " + lastLetter,
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


/* Start New Game button behaviour */
function setStartNewGameButtonBehaviour() {
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
