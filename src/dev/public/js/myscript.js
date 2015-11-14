
var myDataRef = new Firebase('https://matei.firebaseio.com/');
$('#wordInput').keypress(function (e) {
  if (e.keyCode == 13) {
    var name = $('#nameInput').val();
    var text = $('#wordInput').val();
    myDataRef.push({name: name, text: text});
    $('#wordInput').val('');
  }
});
myDataRef.on('child_added', function(snapshot) {
  console.log("child_added")
  var message = snapshot.val();
  displayChatMessage(message.name, message.text);
});
function displayChatMessage(name, text) {
  $('<div/>').text(text).appendTo($('#ownWordsDiv'));
  $('#ownWordsDiv')[0].scrollTop = $('#ownWordsDiv')[0].scrollHeight;
};