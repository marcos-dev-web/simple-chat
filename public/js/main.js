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

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (input.value.length > 0) {
      newMessage(input.value, 'me')
      socket.emit('message', input.value);
      input.value = ""
    }
  }
})

socket.on('new_message', (msg) => {
  newMessage(msg, 'he')
})