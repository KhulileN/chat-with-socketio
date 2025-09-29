const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Prompt for username
let myUsername = prompt("Enter your name:", "Me") || "Me";

// Fixed color for the sender
let myColor = '#007bff'; // e.g., blue for yourself

// Submit message
form.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});

// Press Enter to send (without Shift)
input.addEventListener('keydown', (e) => {
  if(e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Send message function
function sendMessage() {
  if (input.value.trim() === '') return;
  const msg = input.value;
  addMessage(msg, 'sent', myUsername, myColor);
  socket.emit('chat message', { msg, username: myUsername, color: myColor });
  input.value = '';
}

// Receive messages from other users
socket.on('chat message', (data) => {
  // If the incoming message is from another user, assign their color
  if(data.username !== myUsername) {
    addMessage(data.msg, 'received', data.username, data.color);
  }
});

// System messages
socket.on('system message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  item.className = 'system';
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

// Function to display a message
function addMessage(msg, type, username, color) {
  const item = document.createElement('li');
  item.textContent = `${username}: ${msg}`;
  item.style.backgroundColor = color;

  if(type === 'sent') {
    item.className = 'sent';
  } else if(type === 'received') {
    item.className = 'received';
  }

  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}
