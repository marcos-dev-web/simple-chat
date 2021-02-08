var socket = io();
window.addEventListener("onload", () => {
  document.querySelector('input[type="text"]').focus();
});
window.addEventListener("click", () => {
  document.querySelector('input[type="text"]').focus();
});

let input = document.querySelector('input[type="text"]');

function newMessage(msg, cls) {
  let box = document.querySelector('.box_message');
  let li = document.createElement('li')
  li.classList.add('msg');
  li.classList.add(cls);
  li.innerText = msg
  box.appendChild(li)
}

function send() {
  if (input.value.length > 0) {
    newMessage(input.value, 'me')
    socket.emit('message', input.value);
    input.value = ""
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
})
