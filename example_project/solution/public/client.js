var username = prompt('Bitte gib deinen Namen ein') || 'Anonym';
var socket = new WebSocket('ws://localhost:3000');
var chat = document.getElementById('chat');
var input = document.getElementById('messageInput');
var sendBtn = document.getElementById('sendBtn');
socket.addEventListener('message', function (event) {
    var li = document.createElement('li');
    li.textContent = event.data;
    chat.appendChild(li);
});
sendBtn.addEventListener('click', function () {
    var text = input.value;
    if (!text.trim())
        return;
    var msg = {
        name: username,
        text: text
    };
    socket.send(JSON.stringify(msg));
    input.value = '';
});
