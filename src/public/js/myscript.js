var dice1 = "AAUIHJ";
var dice2 = "TRNSMB";
var dice3 = "AARCDM";
var dice4 = "EEIODF";
var dice5 = "AEUSFV";
var dice6 = "TLNPGC";
var dice7 = "AIOEXZ";
var dice8 = "NSTRGB";
var dice9 = "IIUELP";

$( document ).ready(function() {
    var randNum = Math.floor(Math.random() * 6);
    $('#letter1').html(dice1.charAt(randNum));
    $('#letter2').html(dice2.charAt(randNum));
    $('#letter3').html(dice3.charAt(randNum));
    $('#letter4').html(dice4.charAt(randNum));
    $('#letter5').html(dice5.charAt(randNum));
    $('#letter6').html(dice6.charAt(randNum));
    $('#letter7').html(dice7.charAt(randNum));
    $('#letter8').html(dice8.charAt(randNum));
    $('#letter9').html(dice9.charAt(randNum));
});

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
