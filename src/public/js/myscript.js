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

/*****************************************************************************/



/*** DOCUMENT READY **********************************************************/

$(document).ready(function() {
    setLetters();
    setWordInputBehaviour();
});

/*****************************************************************************/



/*** FUNCTIONS ***************************************************************/

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
    $('#wordInput').keypress(function(e) {
        /* On enter pressed */
        if (e.keyCode == 13) {
            var word = $('#wordInput').val();

            /* Ask server for validation */
            $.get("/" + word, function(data) {
                /* Valid */
                if (data == "1") {
                    $('#wordInput').css({'background-color': 'green'});
                    setTimeout(function() {
                        $('#wordInput').css({'background-color': 'white'});
                    }, 500);

                    $('<div>').text(word).prepend($('<em/>').text('')).appendTo($('#ownWordsDiv'));;
                    $('#ownWordsDiv')[0].scrollTop = $('#ownWordsDiv')[0].scrollHeight;
                }

                /* Invalid */
                else {
                    $('#wordInput').css({'background-color': 'red'});
                    setTimeout(function() {
                        $('#wordInput').css({'background-color': 'white'});
                    }, 500)
                }

                /* Clear word input */
                $('#wordInput').val('');
            });
        }

        /* On normal key pressed */
        else {
            var lastLetter = String.fromCharCode(e.keyCode).toLowerCase();

            /* Valid letter */
            var indexOfLastLetter = letters.toLowerCase().indexOf(lastLetter);
            if (indexOfLastLetter > -1) {
                $('#letter' + indexOfLastLetter).css({'background-color': 'red'});
                letters = letters.substr(0, indexOfLastLetter) + '#' +
                          letters.substr(indexOfLastLetter + 1);
            } else {
                return false;
            }
        }
    });

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
