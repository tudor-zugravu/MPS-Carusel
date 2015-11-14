
// var myDataRef = new Firebase('https://matei.firebaseio.com/');
// $('#messageInput').keypress(function (e) {
//   if (e.keyCode == 13) {
//     var name = $('#nameInput').val();
//     var text = $('#messageInput').val();
//     myDataRef.push({name: name, text: text});
//     $('#messageInput').val('');
//   }
// });
// myDataRef.on('child_added', function(snapshot) {
//   console.log("child_added")
//   var message = snapshot.val();
//   displayChatMessage(message.name, message.text);
// });
// function displayChatMessage(name, text) {
//   $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
//   $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
// };

$('#letter1').html('litera1');

$('#wordInput').keypress(function (e) {
  if (e.keyCode == 13) {
    var word = $('#wordInput').val();
    $('#wordInput').val('');

    $.get("/" + word, function(data) {
      console.log("Data: " + data);
    });
  }
});
