$('#wordInput').keypress(function(e) {
  if (e.keyCode == 13) {
    var word = $('#wordInput').val();

    $.get("/" + word, function(data) {
      if (data == 'valid') {
        $('#wordInput').css({'background-color': 'green'});
        setTimeout(function() {
          $('#wordInput').css({'background-color': 'white'});
        }, 500)
      } else {
        $('#wordInput').css({'background-color': 'red'});
        setTimeout(function() {
          $('#wordInput').css({'background-color': 'white'});
        }, 500)
      }

      $('#wordInput').val('');
    });
  }
});
