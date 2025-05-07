const username = prompt('Bitte gib deinen Namen ein') || 'Anonym';
const socket = new WebSocket('ws://localhost:3000');

const chat = document.getElementById('chat') as HTMLUListElement;
const input = document.getElementById('messageInput') as HTMLInputElement;
const sendBtn = document.getElementById('sendBtn') as HTMLButtonElement;

socket.addEventListener('message', (event) => {
    const li = document.createElement('li');
    li.textContent = event.data;
    chat.appendChild(li);
});

sendBtn.addEventListener('click', () => {
    const text = input.value;
    if (!text.trim()) return;

    const msg = {
        name: username,
        text: text
    };

    socket.send(JSON.stringify(msg));
    input.value = '';
});
