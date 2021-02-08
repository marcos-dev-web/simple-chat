const box = document.querySelector('.box_message');
const socket = io();
var nmsg = 0;

window.addEventListener("onload", () => {
  document.querySelector('input[type="text"]').focus();
});
window.addEventListener("click", () => {
  document.querySelector('input[type="text"]').focus();
});

let input = document.querySelector('input[type="text"]');

function newMessage(msg, cls) {
  let li = document.createElement('li')
  li.classList.add('msg');
  li.classList.add(cls);
  li.innerText = msg
  box.appendChild(li)
  box.scroll(0, box.scrollHeight)
}

function send() {
  if (input.value.length > 0) {
    newMessage(input.value, 'me')
    socket.emit('message', input.value);
    input.value = ""
    document.title = "Chat"
    nmsg = 0;
    box.scroll(0, box.scrollHeight)
  }
}

document.querySelector('.send').addEventListener('click', () => {
  send()
})

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    send()
  }
})

socket.on('new_message', (msg) => {
  newMessage(msg, 'he')
  nmsg++;
  document.title = `Chat - (${nmsg})`;
})
