$(document).ready(function() {
  setWordInputBehaviour();
});

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
          }, 500)
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
  });
}
